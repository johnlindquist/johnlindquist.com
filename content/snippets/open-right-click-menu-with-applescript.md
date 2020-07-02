---
slug: open-right-click-menu-with-applescript
title: Open Right-Click Menu With AppleScript
date: 2020-06-22 10:06
published: true
category: ['']
---
```applescript
tell application "System Events"
    tell process "Finder"
        set target_index to 1
        set target to image target_index of group 1 of scroll area 1
        tell target to perform action "AXShowMenu"
    end tell
end tell
```




