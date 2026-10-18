---
layout: post
title: "Cult Focus: A Coin You Tap to Lock Your Phone"
subtitle: "Why the exit from distraction had to be a physical object, how I hid an NFC tag and two magnets inside a printed puck, and why the moat is the design, not the code"
description: "Screen Time fails because the same hand that sets the limit lifts it. So the unlock became a coin you tap. The honest version: a free app and a blank tag can do the same thing, and everything interesting is downstream of admitting that."
date: 2026-10-16 20:00:00 +0530
author: Vishalan Gharat
categories: making
tags: [3d-printing, nfc, ios, swift, focus, maker]
image: /img/blog/cult-focus-hero.png
---

<figure class="post-media post-hero">
  <img src="/img/blog/cult-focus-hero.png" alt="An NFC coin tapping a phone that locks">
</figure>

The built-in screen-time controls on your phone do not work, and the reason is almost funny. The same hands that set the limit can lift it. You tap through your own restriction in a second and you do not even feel it happen. The limit and the override live in the same place, which means there is no real friction anywhere in the loop.

So I moved the override out of the phone and into an object. Cult Focus is a small 3D-printed coin with an NFC tag inside it. The app blocks whatever apps you choose, and the only way out of a hard lock is to physically find the coin and tap it. The coin is not an unbreakable lock. It is a commitment key, a deliberate speed bump between you and the thing you keep reaching for without deciding to. The whole pitch fits on one line. The scroll ends with a tap.

## The moat is not the code, and saying so is the point

Here is the part most product posts would hide. There is nothing technically defensible about this. A free, open-source app and a blank tag you can buy for twenty rupees will do essentially the same thing. If I pretend otherwise, I am lying to the one person a side project should never lie to, which is me.

So the value has to come from somewhere other than novelty. It comes from the object being genuinely nice to own, from the setup being easy enough that a normal person actually finishes it, and from the whole thing being bought once with no subscription, ever. That last one is a hard line. A physical good sits outside the app store's in-app-purchase rules, so there is no platform cut and no recurring charge, and that is a feature I am proud of precisely because it is a constraint I chose. When you accept that your moat is design and convenience rather than technology, you stop trying to out-engineer a problem that engineering cannot win, and you start doing the work that actually matters.

## Hiding a tag and two magnets inside a printed coin

The coin is where the engineering got hands-on, and most of what I learned was about printing, not software.

The first version printed face up, logo pointing at the sky, and it looked terrible: a lined top surface, a ragged thin ring around the mark, a stepped rim, strings everywhere. Raised text printed into open air is a mess. So I flipped it. The coin now prints face down against the bed, which gives a glass-smooth front, and the logo is a flush inlay rather than raised relief. The bed does the finishing for you.

Inside the puck is an NFC sticker and, under it, a pair of small magnets so the coin can clamp to a fridge or a desk. The magnets created the most interesting fight. A magnet sitting directly behind the antenna weakens or kills the read, so the layout had to keep the metal far enough off-centre that the antenna barely notices it. And the material matters: the coin has to be printed in plain plastic, never anything with carbon or metal in it, because those block the radio entirely.

The genuinely fiddly bit is that the magnets go in during the print. The model pauses itself twice: once early to press the NFC sticker into a pocket, and once partway up to drop glue and the magnets in before the printer seals over them, with the next layer landing only a fraction of a millimetre above the magnet tops. I also stopped trusting the slicer's own project files, because hand-edited settings get silently ignored unless the file is a complete, printer-authored project. The reliable trick was to save one real project once and then swap only the shapes into it, leaving all the finicky configuration intact. A verifier script checks the result against a few dozen rules before anything prints, so a coin that would fail is caught in software rather than in plastic.

## Why the app is native, and nothing else

People always ask why this is not a cross-platform app, and the answer is specific. The screen-blocking on an iPhone is delivered through small system extensions that run as separate processes with hard, low memory ceilings. You cannot boot a JavaScript or a Dart runtime inside one of those; there is simply not enough room. And a web app cannot do this at all, because the browser has no way to block other apps. The platform hands you exactly one door, and it is native. So the core is written in Swift, with a shared, tested package holding the rules, and the cryptography in it is checked against the standard published test vectors rather than against my own confidence. That same core is ported to run on Android.

I will not oversell the security. The stock tag proves possession, it does not prove authenticity, and a determined person with the right blank tag can clone an identifier. The stronger anti-counterfeit design, with a per-tap signature and keys that never leave a secure store, is designed but not yet built, and the rule that holds the whole scheme together is a nice one to end on: a server must never hand out a key for a tag the caller has not physically proven they are holding, or the server becomes a machine for minting fakes. That post can wait until the thing exists.

The coin is live and the app is out. Whether enough people will pay for a nicer version of something they could cobble together for free is the question I have not finished answering, and it is the only question that matters. I know how to answer it honestly. That, more than any clever print trick, is the part I am actually trying to get right.
