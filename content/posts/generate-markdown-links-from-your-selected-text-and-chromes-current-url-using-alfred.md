---
slug: generate-markdown-links-from-your-selected-text-and-chromes-current-url-using-alfred
title: Generate Markdown Links From Your Selected Text and Chrome's Current Url Using Alfred
date: 2020-06-11 14:06
published: true
category: ['automation']
---

I've been spending a lot of time trying to optimize the workflow around adding more posts to my [digital garden](https://johnlindquist.com/) and a couple of the biggest holdups were around adding links to pages I was looking at in Chrome. I figured I'd take a stab at optimizing the process based on my [Alfred](https://www.alfredapp.com/) experience and everything I've been learning with zsh. I came up with a flow I'm pretty happy with:

1. Hit a keyboard shortcut so [Alfred](https://www.alfredapp.com/) can grab the selected text

2. Push the selected text into a "Script" step that can grab the current URL from Chrome using osascript and combine them together

3. Output using the "Copy to Clipboard" output template.

I'm really happy with the result. You can see it in action below:





<EggheadEmbed slug="egghead-generate-a-markdown-link-from-selected-text-with-chrome-s-current-url-using-alfred"/>
