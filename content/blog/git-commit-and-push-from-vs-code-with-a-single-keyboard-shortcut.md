---
slug: git-commit-and-push-from-vs-code-with-a-single-keyboard-shortcut
title: Git Commit and Push From VS Code With a Single Keyboard Shortcut
date: 2019-04-20 19:04
published: true
---

First, install the [runInTerminal](https://marketplace.visualstudio.com/items?itemName=kortina.run-in-terminal) extension.

Then, add the following to your keyboard shortcuts:

```json
{
  "key": "cmd+shift+p",
  "command": "runInTerminal.run",
  "args": {
    "cmd": "git add . && git commit -m \"`date`\" --allow-empty && git push",
    "match": ".*"
  }
}
```

- `&&` will wait for the previous command to finish before executing
- `git add .` will add all files to be commited
- `` git commit -m \"`date`\" --allow-empty `` will commit with the current date as a message even allowing commiting no changes (important if you're just creating a branch without changes)
- `git push` pushes the branch

Final note, I published this blog post with that keyboard shortcut :)
