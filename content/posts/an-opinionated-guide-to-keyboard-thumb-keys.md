---
slug: an-opinionated-guide-to-keyboard-thumb-keys
title: An Opinionated Guide to Keyboard Thumb Keys
date: 2020-08-17 10:08
published: true
category: ['keyboard']
---

I've used a lot of keyboards over the years. All of my favorite keyboards include thumb clusters:

- [keyboardio](https://shop.keyboard.io/)
- [kinesis advantage 2](https://kinesis-ergo.com/shop/advantage2/)
- [ultimate hacking keyboard](https://ultimatehackingkeyboard.com/)
- [ergodox](https://www.ergodox.io/)

I'm constantly tweaking my keyboard layouts using their various configuration tools and [karabiner](https://karabiner-elements.pqrs.org/). The following are my recommendations for thumb keys:

## The Almighty Spacebar

Are you a left-thumber or a right-thumber? Many people don't realize they have a dominant thumb when striking the spacebar. Since the spacebar is the key you're going to use the most you shuold also give it the highest priority and most comfortable spot.

- Spacebar: Left side, most comfortable (usually largest) key.

## Shift Key: It's Really a Layer, but 🤷‍♂️

When I think of the shift key, I think of it as a "Layer Key" that triggers alternative uses for every other key press. I find this mindset help people who are new to layers realize just how useful they are. This also highlights how useless it is to have two shifts keys on the keyboard which we'll address down below.

The Shift key is your 2nd highest priority thumb key. Place it opposite your spacebar key.

- Shift: Right side, most comfortable (usually largest) key.

## Command Key

The vast majority of the commands you use will be on the left side of the keyboard: cmd+c, cmd+v, cmd+z, etc. That, in combination with using your mouse in your right hand (sorry left-handers...), is a very common situation.

- Command: Left side, 2nd most comfortable key

## Escape

If you're reading this, you're probably a programmer and you probably use the Escape key _a lot_ just like I do. I consider it the 4th most important key after Spacebar, Shift, and Command.

- Escape: Right side, 2nd most comfortable key

## Option and Control Keys

These really depend on your personal workflow (I'm looking at you, Emacs people). I typically avoid keyboard shortcuts like "cmd+alt+whatever" and use multiple layers to achive those sorts of shortcuts instead. Also, "Option" is a Layer key, just like Shift, but I _rarely_ use the Option Layer. Instead, I'll use Option to map shortcuts in VS Code or other tools. The same goes for Control, if some app has a keyboard shortcut that demands I use it, I do, but I otherwise forget about it.

- Option and Control: Right side, usually on the "edges" or hardest to reach part of the cluster.

## Tab

Tab is a strange one. Used for whitespace or cycling through apps, it's got a weird history. If we wanted to, we could probably get rid of tab altogether. Use Shift+Spacebar for a Tab whitespace and Command+ [ or ] for cycling through apps. But, that's not the way the world works (unless you want to remap those, I'm not going to stop you). I still use Tab the way it was originally intended.

- Tab: Left side, on the edge.

## Alfred Key

I'm an [Alfred](https://www.alfredapp.com/) power user. Or superpower user. It's one of the tools that keep my attached to OSX (along with Karabiner and Screenflow). I make sure to keep a dedicated key just for launching Alfred because Option+Spacebar is too much work for a key I use so often.

- Alfred key: Left side, on the edge.

## Snippet Key

I use § (this is a "non-us backslash") as a "snippet identifier". If I type a couple characters, following by a §, then it invokes my [snippets from Alfred](https://www.alfredapp.com/help/features/snippets/). I strongly recommend using a snippets app for common things like your email address (like "@§" for your personal email and "!§" for your work email).

- Snippet key: Right side, on the edge

## Tilde Key

I use ` quite a bit for writing strings in JavaScript and also for cycling between windows of the same app with Command+Tilde. So I gave it the last spot in my right thumb cluster:

Tilde key: Right side, on the edge

## Left and Right Shift?

Since we have a big Shift key comfortable sitting underneath a thumb at all times, let's make the Left and Right Shift Keys 1000x more useful.

- Left Shift: Remap to Backspace
- Right Shift: Remap to Delete

This makes combinations like Command+Backspace for deleting lines or Option+Backspace for deleting words _really easy_.

## With Thumb Keys, Keep a Homerow Layer Mindset

Spacebar, Tab, Escape, Alfred key, §, and ` all have one thing in common. They don't do anything when you're holding them down (other than repeat themselves). This makes them all ideal canditates for Layers! (Remember: Shift, Command, Option are already layers and I think Return is too dangerous to use as a Layer key).

Here's my current Layer mindset:

- Spacebar + homerow keys from left to right: `[,],(,), => , ={} , {}, <>, =""`
- § + homerow keys are the numbers: 1234567890
- Tab + homerow keys are Shift+numbers: !@#\$%^&\*
- ` + homerow keys: I'm currently exploring options
- Alfred + homerow keys: Launch common Alfred workflows

This means that I _never_ reach for the numbers keys in the top row on the keyboard.

![Kinesis Suggested Thumb Keys](https://jmp.sh/P9Sho52+/Screen+Shot+2020-08-17+at+11.40.33+AM.png)
