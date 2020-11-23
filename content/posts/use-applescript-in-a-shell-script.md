---
slug: use-applescript-in-a-shell-script
title: Use AppleScript in a Shell Script
date: 2020-11-23
published: true
category: ['AppleScript']
---

## Use AppleScript in a Shell Script

You can write AppleScript as Shell Scripts just as you would with any other bash/zsh file. The key requirement is that you start the file with the appropriate shebang line:

```shell
#! /usr/bin/env osascript
```

Then make sure you correctly grab your arguments

```applescript
 --grabs the first argument
set myArgument to (item 1 of argv)
```

```applescript
#! /usr/bin/env osascript

-- usage: `open-tab twitter`
-- Opens chrome, checks if twitter is already open,
-- switches to existing tab. Opens a new tab it not.

on run argv
	set address to (item 1 of argv)

	tell application "Google Chrome"
		activate
		if not (exists window 1) then reopen
		repeat with w in windows
			set i to 1
			repeat with t in tabs of w
				if URL of t contains address then
					set active tab index of w to i
					set index of w to 1
					return
				end if
				set i to i + 1
			end repeat
		end repeat
		open location "http://" & address
	end tell

end run
```
