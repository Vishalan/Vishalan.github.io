---
layout: post
title: "A Private AI Cloud From Three Dead Machines"
subtitle: "An idle gaming PC, a NAS, and a fourteen-year-old laptop, wired together over Tailscale to run an AI pipeline and sandbox an agent"
description: "Reusing old hardware for real AI work: a 3090 desktop as the compute node, a Synology NAS as the always-on control plane, and a 2012 laptop as a padded-room sandbox for a coding agent. The constraints wrote the architecture."
date: 2026-10-14 20:00:00 +0530
author: Vishalan Gharat
categories: engineering
tags: [homelab, ai, tailscale, claude-code, self-hosting, hardware]
image: /img/blog/homelab-hero.png
---

<figure class="post-media post-hero">
  <img src="/img/blog/homelab-hero.png" alt="Three machines linked over a network to a central private-cloud node">
</figure>

I have three machines in my house that, by any reasonable measure, should be in a landfill. A gaming desktop that sat idle after I stopped playing. A fourteen-year-old laptop. A small NAS bought to hold photos. Together they now run an AI content pipeline, local inference, home automation, and a sandbox where a coding agent is allowed to do its worst. None of them cost me anything new, and the interesting part is that the limitations of each one, not the capabilities, are what shaped the whole design.

## The cast

The desktop is the muscle. It has an RTX 3090 with 24 GB of memory, which is a lot of local compute to leave switched off. It runs the pipeline work that actually needs a GPU: text-to-speech, a lip-sync model, embeddings through a local Ollama. I wiped Windows off it and gave it one job.

The NAS is the thing that never sleeps. It is slow and has very little memory, so it runs nothing heavy. What it has going for it is that it is always on, and that turns out to be the most valuable property in the whole setup. It holds the storage and, more importantly, it is the control plane.

The laptop is a 2012 Lenovo with eight gigabytes of memory and a battery at about eighty percent of its original health. That is not enough to run a model, but it is plenty to run a coding agent and a few containers. So that is exactly what it became: an isolated box where Claude Code can run with internet access and absolutely no route to anything else I own.

## The agent's padded room

The laptop is the part I am most pleased with. If you let an autonomous coding agent run with real tools, you want it somewhere it cannot reach your production machines, your storage, or your network, no matter what it or something it installs decides to do. A spare, disposable, always-on box is close to ideal for that, and I had one gathering dust.

The isolation is one firewall rule. The agent and everything it spawns run under a single user id, and because the container runtime maps container-root to that same id, one rule covering that id covers the user and every container it ever starts. Outbound to the internet is allowed, so the agent can talk to the API it needs. Everything private is refused: the home network, the storage, the GPU box, the router. I tested it by trying to reach each of those from inside the sandbox and watching them all fail, which is the only kind of security claim worth making.

The battery earns its place too. On a desktop you would buy a small UPS so a power blip does not corrupt a disk mid-write. This laptop came with one built in. I capped the charge to protect the cell, told it to ignore the lid and never sleep, and set it to shut down cleanly at ten percent so the filesystem never sees a hard power cut. A dead laptop's battery became free, uninterruptible power.

The last touch I like: the agent reports on itself. Claude Code can emit telemetry, so its cost, tokens, sessions, commits, and accept rate flow off the laptop into a dashboard. The machine that was too old to run a model is perfectly capable of watching one work.

## The monitoring cannot live on the machine it watches

The GPU box has a habit of falling over, which I will come back to. Because it falls over, I built a watchdog that power-cycles it when it stops responding. And the one thing that watchdog absolutely cannot run on is the GPU box, because a crashed machine cannot reboot itself. So it runs on the NAS, the one machine that is always up. The same logic put all the monitoring there. The thing that watches your fleet has to be the thing most likely to still be alive when something breaks.

That principle is why the NAS, the least capable machine of the three, ended up with the most important job. It is not doing heavy work. It is just the one I can trust to be there.

The watchdog itself has opinions I had to learn the hard way. It only acts when every way of reaching the box has failed, not just one, because a single crashed service is not a dead machine and should not trigger a reboot. It waits a full minute with the power off, because a shorter cut does not actually clear the fault. And it gives up after three cycles in a day and calls me instead, because a machine stuck in a boot loop is not fixed by more reboots. It is fixed by a human looking at it.

## Why the box falls over, and other lessons from breaking things

The GPU box was dying with no error anywhere. No panic, no log, nothing. It would just go dark. Every stress test I ran passed. The fault turned out to be the power supply latching off on the microsecond current spikes a 3090 throws on a sudden jump in load, not on any sustained draw, which is exactly why steady stress tests could never reproduce it. The real fix is a new power supply. Until then, the watchdog brings it back and a hard cap on the GPU keeps the spikes small enough to mostly behave.

A few other things that only reuse-at-home teaches you:

Cooling a GPU that lives in a sealed compartment is about the box, not the chip. The enclosure is the thermal limit, so the fix is to pull the hot air out, and the fan logic is subtle: fast sensors like the processor decide when to start the fan, but slow, heavy things like the hard drive decide when it is safe to stop. I shipped a bug where the fan latched on forever because I set its off-temperature below what the compartment could actually reach with the fan running. Thresholds have to come from what is achievable with the remedy on, not from a spec sheet.

Checking for a tool can install it. I ran a program with a version flag just to see if it was present, and the system's helpful shim installed the whole thing for me. Now I check whether a command exists, I do not run it to find out.

And my own notes lied to me. They said a disk was failing and the box still dual-booted Windows. Both had been false for weeks. The rule I keep repeating to myself is to verify live and never trust the stored version of reality, which is good advice for a homelab and better advice for everything else.

## Reuse is a discipline, not a junk drawer

The network holding all this together is Tailscale, and there is exactly one rule I will not break: none of it is exposed to the public internet. Everything talks over the private tailnet, addressed by name rather than by address, because the one time I used fixed addresses a router reshuffle silently broke the monitoring and I spent an evening learning why.

What surprised me most is how little of this was about the models. The AI parts mostly worked. The hard, interesting problems were a power supply, a fan, a firewall rule, and the discipline of proving a failure path instead of assuming it. Reusing old hardware is not about saving money, though it does. It is a standing reminder that infrastructure is the part you only understand once you have watched it fail.
