---
slug: building-a-privacy-vs-code-extension
title: Building a Privacy VS Code Extension
date: 2019-11-20 15:11
published: true
category: ['VSCode']
---

<YoutubeEmbed slug="JlZfe_eTPuI"/>

## Goal

The goal of this stream was to build a VS Code extension
that could hide all of the `values` displayed in a `.env`
file.

## The Outcome

We got so close to getting everything working, but when
using the event system in VS Code, the file would completely
render out the values of the `.env` file for a brief second
then they would disapper. For the purposes of streaming,
this simply wasn't acceptable. Showing the values even for
that short amount of time made a potential extension worthless.

Unfortunately, we ran into the limitations of VS Code. It's
currently impossible to manipulate the font of a file before
the file has loaded. There's nothing in VS Code to hook
into to change things early enough.

<TwitterEmbed tweet="https://twitter.com/roblourens/status/1194378966813102083"/>
