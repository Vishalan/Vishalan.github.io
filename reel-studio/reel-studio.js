// Reel Studio sales page: email step, then Gumroad checkout.
// The checkout link lives here only. The plain hrefs in the HTML are the
// no-JS fallback; this script rewrites them from GUMROAD_URL on load.
const GUMROAD_URL = "https://vishalan.gumroad.com/l/reel-studio";

const LEAD_ENDPOINT = "https://formsubmit.co/ajax/reach.vishalan.ai@gmail.com";
const LEAD_TIMEOUT_MS = 3000;

(function () {
  "use strict";

  var pageParams = new URLSearchParams(window.location.search);

  function utmParams() {
    var out = {};
    pageParams.forEach(function (value, key) {
      if (/^utm_/i.test(key)) out[key] = value;
    });
    return out;
  }

  // Checkout URL: open the checkout straight away and carry utm_* through.
  // The email is never put in the URL.
  function checkoutUrl() {
    var url = new URL(GUMROAD_URL);
    url.searchParams.set("wanted", "true");
    var utm = utmParams();
    Object.keys(utm).forEach(function (k) { url.searchParams.set(k, utm[k]); });
    return url.toString();
  }

  var buyLinks = document.querySelectorAll(".js-buy");
  buyLinks.forEach(function (a) { a.href = checkoutUrl(); });

  // Video slots: hide the placeholder once a poster or a frame actually loads.
  document.querySelectorAll(".reel-box, .walk-box").forEach(function (box) {
    var video = box.querySelector("video");
    if (!video) return;
    var done = function () { box.classList.add("has-media"); };
    video.addEventListener("loadeddata", done);
    var poster = video.getAttribute("poster");
    if (poster) {
      var img = new Image();
      img.onload = done;
      img.src = poster;
    }
  });

  var dialog = document.getElementById("lead");
  if (!dialog || typeof dialog.showModal !== "function") return; // old browser: links go straight to Gumroad

  var form = document.getElementById("lead-form");
  var email = document.getElementById("lead-email");
  var honey = document.getElementById("lead-hp");
  var err = document.getElementById("lead-err");
  var go = document.getElementById("lead-go");
  var closeBtn = document.getElementById("lead-close");
  var sending = false;

  buyLinks.forEach(function (a) {
    a.addEventListener("click", function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return; // let new-tab clicks through
      e.preventDefault();
      err.hidden = true;
      email.removeAttribute("aria-invalid");
      dialog.showModal();
      email.focus();
    });
  });

  closeBtn.addEventListener("click", function () { dialog.close(); });
  dialog.addEventListener("click", function (e) {
    if (e.target === dialog) dialog.close(); // click on the backdrop
  });

  function validEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) && email.checkValidity();
  }

  function goToCheckout() {
    window.location.assign(checkoutUrl());
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (sending) return;
    var value = email.value.trim();
    email.value = value;
    if (!validEmail(value)) {
      err.hidden = false;
      email.setAttribute("aria-invalid", "true");
      email.focus();
      return;
    }
    err.hidden = true;
    email.removeAttribute("aria-invalid");

    // A bot filled the hidden field: skip the lead, still send them on.
    if (honey.value) { goToCheckout(); return; }

    sending = true;
    go.disabled = true;
    go.textContent = "Opening checkout...";

    var payload = Object.assign({
      email: value,
      _subject: "Reel Studio lead",
      _template: "table",
      source: window.location.origin + window.location.pathname,
      timestamp: new Date().toISOString()
    }, utmParams());

    var controller = typeof AbortController === "function" ? new AbortController() : null;
    var finished = false;
    var finish = function () {
      if (finished) return;
      finished = true;
      goToCheckout();
    };
    // Never lose the sale: redirect after the timeout whatever happens.
    var timer = setTimeout(function () {
      if (controller) controller.abort();
      finish();
    }, LEAD_TIMEOUT_MS);

    try {
      fetch(LEAD_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload),
        signal: controller ? controller.signal : undefined
      }).catch(function () { /* ignore, we redirect anyway */ })
        .then(function () { clearTimeout(timer); finish(); });
    } catch (x) {
      clearTimeout(timer);
      finish();
    }
  });
})();
