---
slug: multi-sim-layers-in-karabiner
title: Multiple Sim Layers in Karabiner
date: 2021-07-26 15:57
published: true
category: ['Karabiner']
---

Got a quick Karabiner question on twitter over the weekend:

<blockquote class="twitter-tweet"><p lang="en" dir="ltr"><a href="https://twitter.com/johnlindquist?ref_src=twsrc%5Etfw">@johnlindquist</a> have karabiner edm questions, i want to have layer that activates when holding &lt;Tab&gt; and another layer that activates when holding &lt;Tab-t&gt;, <br/>goal is to have actions like &lt;Tab-h/k/j/l&gt; and other actions for &lt;Tab-t-h/k/j/l&gt;, possible?</p>&mdash; Nadeem Khedr (@NadeemKhedr) <a href="https://twitter.com/NadeemKhedr/status/1419320075627155460?ref_src=twsrc%5Etfw">July 25, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Assuming these two simlayers:

```clojure
 :simlayers {
  :tab-mode {:key :tab}
  :t-mode {:key :t}
 }
```

I would approach combining them like so:

```clojure
{:des "tab"
         :rules [:tab-mode
                 [:h [:o :n :e]];
                 ]}
{:des "tab+t"
  ; order is important*
  :rules [[:condi :tab-mode :t-mode]
          [:h [:t :w :o]];
          ]}
```

`:condi` allows you to define multiple conditions that need to be met for the following rules. This is very helpful for combining simlayers with applications. `[:condi :tab-mode :chrome]` would allow you to define a set of rules specific to Chrome. Or a more complex example would be "Ableton rules when 2 fingers are on the trackpad":

```clojure
[:condi :ableton ["multitouch_extension_finger_count_total" 2]]
[:-r :loop_selection]
[:-s :split_clip]
```

## \*Order is important

You _must_ press "tab", then "t", then "h". But then as long as you're holding down "tab" and "t", you can slam down "h" as many times as you want. You could set up the reverse condition `[:condi :t-mode :tab-mode]`, but then you'd need to press "t" then "tab".
