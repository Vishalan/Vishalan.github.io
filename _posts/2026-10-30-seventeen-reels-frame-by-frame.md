---
layout: post
title: "I Took Seventeen Reels Apart, Frame by Frame"
subtitle: "What the best explainer reels do with numbers, sound and silence, and how it turned my video engine into a skill anyone can run"
description: "I downloaded seventeen popular explainer reels, cut them into frames, transcribed them and measured their audio. The patterns were specific enough to code: a number that moves, a tally that fills, cuts in the breath. Then I packaged the engine as Reel Studio, a skill folder for AI coding agents."
date: 2026-10-30 09:00:00 +0530
author: Vishalan Gharat
categories: engineering
tags: [ai, video, motion-graphics, claude-code, agents, skills]
image: /img/blog/reel-studio-hero.png
---

<figure class="post-media post-hero">
  <img src="/img/blog/reel-studio-hero.png" alt="Three frames from reels drawn in code: a step tile on a paper background, a cracking rig terminal on navy, and a frame judge stopping a render">
</figure>

The machine in my house that [makes short videos on its own](/blog/a-content-studio-that-runs-without-me/) had a problem I could not fix by reading its code. Its reels were correct. They were also forgettable. The facts checked out, the captions sat where they should, and people scrolled past anyway.

So I stopped guessing and went to look. I picked seventeen explainer reels that were doing well, downloaded them, cut every one into one-second contact sheets plus frame-by-frame strips around every cut, transcribed them with word timings, and measured their audio in windows of a few dozen milliseconds. Four agents worked through them in parallel, each writing the same ten-section report per reel: hook, script, voice, layout, every graphic in order, every sound, captions, pacing, rules, and what my engine could not do.

## What they all do

Some of it I expected. Some of it contradicted rules I had written down from an earlier, smaller study.

**A number in the corner carries the argument.** Almost every reel keeps a live counter in the top right. It names the chapter's own metric and moves with the story: a liability total that climbs with every fine and drops to zero when the fix lands, a "2/4" that ticks as a list goes by, a follower count running for two seconds straight. A muted viewer can follow the video from that corner alone.

**A tally collects the story.** Many keep a small ledger in the bottom left: empty slots that fill as each item is explained. The main object of each beat does not leave the screen. It shrinks to a fifth of its size and flies into its slot in about six frames, and the slot pulses.

**Cuts sit in the breath.** Every cut I measured lands in a pause between sentences, where the whole mix drops to almost nothing for four to six frames. The silence does the job a whoosh would.

**Pictures arrive just before the words.** My engine drew each graphic on the word that named it. These reels put it two to three frames earlier, and the sound effect lands with the picture, not the voice. It feels like the video is thinking ahead of the narrator.

**One turn, not many.** The problem is told on paper with an orange accent, and on the sentence where the answer starts, the whole frame switches once to navy or black, through a halftone wipe of about thirteen frames that holds solid ink for three. I had been doing a wipe per chapter.

**Abstract claims become props.** A claim about cost becomes a price tag with the old price struck out. A deadline becomes a tear-off calendar. A warning becomes a stop sign that slams in. My engine could only draw app screens.

The voices were text to speech, at three and a half to four words a second, with no pause longer than about a third of a second. Several had no music at all.

## Putting it into the engine

None of that is taste. It is numbers, which means it can be code. The engine draws every frame on a canvas at an exact time, so each finding became a piece the scene writer can ask for: the corner meter with a running total, the ledger and its fly-in exits, numbered step tiles that shrink onto their object, the single turn into a second palette, stamps that slam at one and a half times their size and settle in three frames, a cursor that clicks and gets refused, and props like the calendar, a split-flap counter, a price tag and a stop sign.

The frame judge got stricter too. It now checks contrast: after the turn into a dark palette, some cards had light text on light backgrounds, and the old judge passed them because the text was technically on screen.

## Then I packaged it

Once the engine was good enough, it seemed a waste to keep it inside one pipeline. So I packaged it as **Reel Studio**: a folder you drop into Claude Code, Codex, Antigravity or Cursor. You type one line with a topic. The agent writes a script meant to be spoken, records it with a free local voice, writes the scene against the same engine, checks every frame, renders in your own Chrome and mixes the sound. Nothing is filmed and no editing app is opened.

<figure class="post-media">
  <video src="/reel-studio/media/walkthrough.mp4" poster="/reel-studio/media/walkthrough.jpg" controls playsinline preload="none"></video>
  <figcaption>The walkthrough, made with Reel Studio itself.</figcaption>
</figure>

Two things I was careful about. The study was for technique only: no creator's footage, characters or layouts went into it, and every graphic is drawn fresh in code. And I wrote down the limits plainly: narration is English for now, and it was built and tested on a Mac.

My own channel, [vishalan.ai](https://www.instagram.com/vishalan.ai/), now runs on the upgraded engine every day. If you want to make reels like these yourself, [Reel Studio is here](/reel-studio/).
