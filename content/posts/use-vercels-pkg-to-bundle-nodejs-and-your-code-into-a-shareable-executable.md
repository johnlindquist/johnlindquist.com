---
slug: use-vercels-pkg-to-bundle-nodejs-and-your-code-into-a-shareable-executable
title: Use Vercel's Pkg to Bundle Node.js and Your Code Into a Shareable Executable
date: 2020-06-17 09:06
published: true
category: ['node.js', 'Automation']
---

![pkg bundling up a node.js hello world app](https://res.cloudinary.com/johnlindquist/image/upload/v1592408960/jdyqckyipc3zavtf9ces.gif)

I've been building [Alfred](https://www.alfredapp.com/) workflows quite a bit recently
and have started leveraging the [Script Filter](https://www.alfredapp.com/help/workflows/inputs/script-filter/) while leveraging node packages and scripts. This works great for my own workflow where I know that I have [node.js](https://nodejs.org/) installed, but I worried
quite a bit about sharing them with friends. Turns out there's a simple way to package up your apps using a tool called [pkg](https://github.com/vercel/pkg). It's been working great for me, so I put together an [egghead](https://egghead.io/) lesson about it:


<EggheadEmbed slug="node-js-package-your-node-js-projects-into-a-standalone-applications-with-pkg"/>
