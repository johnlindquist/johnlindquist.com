---
slug: loop-through-a-directory-and-load-every-file-as-a-function-in-zsh
title: Loop Through a Directory and Load Every File As a Function in Zsh
date: 2020-06-18 16:06
published: true
category: ['Zsh']
---
```bash
for file in ~/.zfunc/**; do
  autoload $file;
done
```




