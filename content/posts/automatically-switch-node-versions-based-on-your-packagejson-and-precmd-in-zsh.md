---
slug: automatically-switch-node-versions-based-on-your-packagejson-and-precmd-in-zsh
title: Automatically Switch Node Versions Based on Your Package.json and Precmd in ZSH
date: 2020-09-14 17:09
published: true
category: ['Node.js', 'nvm', 'zsh']
---

I enjoy using the very latest version of [node.js](https://nodejs.org/) for my quick scripts I write on my computer. That means that my [nvm](https://github.com/nvm-sh/nvm) is set to run Node v14. Every time I've fired up our [egghead-next](https://github.com/eggheadio/egghead-next) project recently, I've had to switch to Node.js v12 (the latest stable version) to run `yarn dev`. I was getting sick of running `nvm use 12` every time I opened a shell, so I set out to see what I could do.

It turns out that [zsh](https://www.zsh.org/) has a [precmd](http://zsh.sourceforge.net/Doc/Release/Functions.html) "hook" that allows you to run some code each time you open a new prompt. That gave me an idea to check my current Node version against the Node version listed in the package.json.

The hook is a function living inside of my [.zshrc](https://superuser.com/questions/886132/where-is-the-zshrc-file-on-mac) file.

You will need to install [jq](https://stedolan.github.io/jq/) for this function since I use it to read the "engines" field on the package.json.

The script reads like this:

1. If a `package.json` exists
2. set the `nodeVersion` to the `.engines.node` field
3. if `nodeVersion` exists and nvm isn't set to that version
4. `nvm use` the first two characters of `nodeVersion`

```bash
precmd(){
  if [ -f package.json ]
  then
    nodeVersion=$(jq -r '.engines.node | select(.!=null)' package.json )
    if [ ! -z $nodeVersion ] \
    && [[ ! $(nvm current) = "^v$nodeVersion" ]]

    then
      echo "found $nodeVersion in package.json engine"
      nvm use ${nodeVersion:0:2}
    fi
  fi
}
```

Now this just runs in the background each time a new prompt fires up and I never have to think about it again! 🎉

Of note, [JRGould](https://twitter.com/jrgould?lang=en) also shared his script with me where he's checking against .nvmrc files. Definitely worth considering this approach too!

<blockquote class="twitter-tweet" data-conversation="none"><p lang="en" dir="ltr">Game changer when switching between a lot of projects. I use the `chpwd` hook which runs whenever you `cd` or `z` or `j` or `..` or whathaveyou into a new dir. Also some fancyness to use .nvmrc and install the required version if I don&#39;t already have it.<a href="https://t.co/R6GHNrudHz">pic.twitter.com/R6GHNrudHz</a></p>&mdash; Jeff Gould (@JRGould) <a href="https://twitter.com/JRGould/status/1305623596430061568?ref_src=twsrc%5Etfw">September 14, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
