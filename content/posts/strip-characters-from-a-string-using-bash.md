---
slug: strip-characters-from-a-string-using-bash
title: Strip Characters From a String Using Bash
date: 2020-05-26 09:05
published: true
category: ['Automation']
---

Today I ran into the scenario where I want to use bash/zsh to remove
the file extension from a string. I wanted to read in the filename, then create
a directory based on the filename. If you copy/paste the following into your terminal,
you should see it work.

```zsh
filename="somefilename.wav"
echo ${filename%.*}
```

Or if you're using it inside of a zsh function and passing in a parameter:

```zsh
removeExtension(){
  echo ${1%.*}
}
```

Whereas you would usually use `$1` to read the parameter, this time we're using
the substituation syntax to both read and remove the `.` and everything after.
