---
layout: post
title: "A Content Studio That Runs Without Me"
subtitle: "Discovering, writing, voicing, rendering and publishing short videos every twelve hours on one gaming GPU, for no marginal cost"
description: "A single RTX 3090 in my house runs an unattended content pipeline: it finds a story, writes a script with claude -p, synthesizes a voice, scores a music bed, renders the video in code, and posts it. The hardest bugs were never the AI."
date: 2026-10-18 20:00:00 +0530
author: Vishalan Gharat
categories: engineering
tags: [ai, llm, automation, homelab, video, remotion, claude-code]
image: /img/blog/content-studio-hero.png
---

<figure class="post-media post-hero">
  <img src="/img/blog/content-studio-hero.png" alt="A GPU feeding a pipeline of stages into a vertical video, running in a loop">
</figure>

Twice a day, a machine in my house picks a story out of the news, writes a short script about it, invents a voice to narrate it, scores a little music bed, draws every frame in code, checks its own work, and posts the result to YouTube, Instagram and Facebook. Nobody presses a button. I usually find out it happened from a Telegram message.

I did not set out to build a media company. I set out to answer a narrower question: could the whole thing run on hardware I already owned, for no marginal cost per video? One RTX 3090, a Claude subscription instead of a metered API, and only free sources for trends. That single constraint, zero marginal cost on the home server, ended up deciding almost every design choice downstream.

## What the pipeline actually does

A run is a chain of stages, and each one caches its output so a failed run resumes instead of starting over.

It ingests a story from free sources (news RSS, publisher feeds, Hacker News, Reddit, GitHub trending, SEC filings). It dedups hard, because the fastest way to get a channel ignored is to say the same thing twice: five layers, from a plain URL check up through title overlap, embedding similarity, and finally an LLM that decides whether two stories are really the same event. It writes a storyboard of sixteen to twenty beats by calling `claude -p` with a JSON schema. It fetches licensed images, keeping a credits file as it goes. It synthesizes the narration locally with Chatterbox, then runs the audio back through speech-to-text to check the voice actually said the words. It generates a music bed and ducks it under the voice. It lays out the timeline from the real audio timings, and it renders the video with Remotion, which is React running headless.

Adding a new channel is not a code change. A channel is a configuration file. There is a rule I kept strict with myself: the engine never looks at which channel or which format it is working on. Everything channel-specific lives in config. That one boundary is the reason the thing grew from one experiment into several brands without turning into a tangle.

## Every pixel is a pure function of time

The rendering rule that mattered most sounds academic until it bites you: every frame has to be a pure function of the timestamp. No `Date.now()`, no animation callbacks, no CSS transitions, no unseeded randomness.

The reason is mundane and unforgiving. Frames render in parallel, out of order, across many headless browser pages at once. The moment one frame depends on anything carried from the last, the video stops being reproducible, and a pipeline that cannot reproduce its own output cannot resume a failed one either. So motion is written as math over time. A spring is a function. A number that ticks up is a function. Even the fonts are embedded as raw data rather than referenced by name, because an installed font renders a little differently on my Mac than on the server, and a renderer that is only deterministic on one machine is not deterministic at all.

I learned that last one the hard way. The server did not have the font the captions expected, so the caption engine silently fell back to a different one that was taller and wider, and every caption ran off both edges of the screen. Nothing errored. It just looked wrong, quietly, until I compared a rendered letter against a reference instead of trusting the file that was supposed to describe it.

## The bug that was not in the software

The best story from this project has nothing to do with AI.

The server kept dying. Not crashing in any way a computer is supposed to crash. No kernel panic, no error from the GPU, nothing in any log. The whole box would just go dark and need the power button held down for fifteen seconds to come back. I ran every stress test I could think of: the processor flat out for a minute, the GPU pinned near three hundred watts for eight minutes, both at once, a fifteen-terabyte memory copy, a hundred voice takes in a row, a hundred transcription passes. Every single test passed. By the logic of software, nothing was wrong.

The tell was physical. When it died, I noticed every light went out except the small one on the memory, which runs on standby power. That pointed away from heat or load and toward the power supply itself. A 3090 does not draw power smoothly. On a sudden step up in work it can pull two to three times its rated figure for a microsecond, and this power supply was latching off on those spikes rather than on any sustained load. I caught it in a trace: one reading at 191 watts and a third of the GPU busy, three seconds later 212 watts and almost fully busy, and the rails dropped. The stress tests all failed to reproduce it because a steady high load is smooth, and the thing that killed it was the jump, not the height.

The lesson I wrote down: ask what the machine looks like when it fails before theorizing about what it is doing. I capped the GPU to tame the spikes enough to keep working. The real fix is a new power supply, and nothing in the codebase can patch that.

## The gates pass, and the video is still wrong

I built a lot of automated gates, because an unattended pipeline lives or dies on them. One renders a single still for every beat before committing to the full render, and fails the video outright if any two elements overlap. It has checked hundreds of beats without a miss. Another refuses any long-form video that opens on a title card, drops below a length floor, or carries the usual tells of machine-written filler.

And then three videos went out with labels that were simply false, and every gate had passed them. One said an AI had written seven hundred and twenty-two maths papers in a single day. It had not. That many were published in a day; they were written over a much longer stretch. Another quoted a price per million words when the figure was per million tokens. A third showed a number I had simulated, under a heading that made it read as measured.

None of these are rendering faults. They are reading faults, the kind a gate that checks layout and length cannot catch, because they are about meaning. So the rule now is that a simulated number has to be labelled as simulated, and that facts still get a human read after the machines are done. The pipeline can do almost everything. The one thing it cannot do is notice when it is confidently wrong about the world.

## Taste was the real bottleneck

My own channel was the project's most useful failure. It had been making short, silent, abstract clips that looked impressive and that nobody could follow. When I finally took apart what actually works in this format, the problem was not the rendering. It was the choosing. The pipeline had been picking topics by how technically interesting they were, which is how you end up making a beautiful video about per-query read depth for sparse offloaded key-value caches. That is a good video for about four hundred people.

The format that works picks canonical questions instead. What is RAG. What is a mixture of experts. Things a lot of people have heard of and cannot quite explain. The fix was not a better renderer or a smarter prompt. It was pointing the thing at the right target, and then building a review loop where the model grades its own work against a measured reference instead of against a number I made up. It only ships when it matches the reference, and it gets a few tries to get there.

That is the part I did not expect going in. I thought the hard problems would be the models: the voice, the script, the images. The models were mostly fine. The hard problems were a power supply, a font, a pile of plumbing around other people's APIs, and taste. The pipeline runs without me now. Deciding what is worth making still does not.
