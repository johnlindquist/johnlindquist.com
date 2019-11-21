---
slug: customize-karabiner-with-goku
title: Customize Karabiner With Goku
date: 2019-10-16 16:10
published: true
---

I love keyboards and I super love keyboard shortcuts.

The #1 reason that I use a Mac is due to a single piece of software: [Karabiner](https://pqrs.org/osx/karabiner/).
I've been using Karabiner for many years now and it's something that you set once and expect it to work every
day that you open up your computer.

## A 2242 Line Config File

Karabiner does provide a GUI for setting some simple keyboard shortcuts, but when you get advanced, you have
to dive into the `karabiner.json` file located at `~/.config/karabiner/karabiner.json`

The JSON quickly gets very verbose and hard to manange. A simple example for _only 2_ shortcuts looks like the code below:

```json
{
        "description" : "symbols",
        "manipulators" : [ {
          "from" : {
            "key_code" : "u",
            "modifiers" : {
              "optional" : [ "any" ]
            }
          },
          "to" : [ {
            "key_code" : "9",
            "modifiers" : [ "left_shift" ]
          } ],
          "conditions" : [ {
            "name" : "symbols",
            "value" : 1,
            "type" : "variable_if"
          } ],
          "type" : "basic"
        }, {
          "from" : {
            "key_code" : "i",
            "modifiers" : {
              "optional" : [ "any" ]
            }
          },
          "to" : [ {
            "key_code" : "0",
            "modifiers" : [ "left_shift" ]
          } ],
          "conditions" : [ {
            "name" : "symbols",
            "value" : 1,
            "type" : "variable_if"
          } ],
          "type" : "basic"
        }
```

While this is very powerful, it's CRAZY how long your `karabiner.json` file can get.

## Enter Goku

Let's compare that `json` to an `.edn` file we can create with `Goku`:

```clojure
 {:des "symbols"
         :rules [:symbols

                 [:##u :!S9]
                 [:##i :!S0]
```

## Setup

You probably won't believe it, but that tiny snippet expresses what is written in that huge chunk of json above.
The tool you'll need to make this happen is called [Goku](https://github.com/yqrashawn/GokuRakuJoudo)

1. First, add a `Default` profile in your Karabiner preferences.

2. Then, installation is easy with `brew`:

```bash
brew install yqrashawn/goku/goku
```

3. Create a `karabiner.edn` file in your `~/config/karabiner.edn`

4. Finally, run `gokuw` and Goku will automatically watch for file changes in the `karabiner.edn` file and
   add them to the `Default` profile of your `~/config/karabiner/karabiner.json` file.

I struggled a bit figuring out the syntax of everything, but once I did, creating everything I needed has
become way easier. I'm absolutely in love with it.

For reference, here's my `karabiner.edn` file in all its glory:

```clojure

{:layers {:homerow {:key :caps_lock :alone {:key :escape}}
          :symbols {:key :tab}}
 :main [{:des "multitouch"
         :rules [:multitouch_extension_finger_count_total
                 [:spacebar :button1]
                 [:f :button1]
                 [:d :button2]
                 [:s :button3]
                 [:z [:button1 :!Cz]]
                 [:x [:button1 :!Cx]]
                 [:c [:button1 :!Cc]]
                 [:v [:button1 :!Cv]]]}

        {:des "homerow"
         :rules [:homerow
                 [:##f :left_option]
                 [:##d :left_shift]
                 [:##s :left_command]

                 [:##n :delete_or_backspace]
                 [:##period :delete_forward]

                 [:##y :home]
                 [:##o :end]

                 [:##h :left_arrow]
                 [:##j :down_arrow]
                 [:##k :up_arrow]
                 [:##l :right_arrow]]}

        {:des "symbols"
         :rules [:symbols

                 [:##u :!S9]
                 [:##i :!S0]
                 [:##o :equal_sign]
                 [:##p :!Speriod]

                 [:##j :!Sopen_bracket]
                 [:##k :!Sclose_bracket]
                 [:##l :open_bracket]
                 [:##semicolon :close_bracket]]}

        {:des "macros"
         :rules [:homerow [:spacebar [:spacebar :equal_sign :spacebar]]
                 :symbols [:q [:equal_sign :!Squote :!Squote]]
                 [:w [:equal_sign :!Sopen_bracket :!Sclose_bracket]]]}

        {:des "taps"
         :rules [[:##left_shift :left_shift nil {:alone :delete_or_backspace}]
                 [:right_shift :right_shift nil {:alone :delete_forward}]
                 [:z :left_shift nil {:alone :z}]
                 [:slash :right_command nil {:alone :slash}]]}

        {:des "shortcuts"
         :rules [;expand selection
                 [:!Fj :!TSCright_arrow]
                 ;shrink selection
                 [:!Fk :!TSCleft_arrow]
                 ;command T
                 [[:f :j] :!Ct]
                 ;command P
                 [[:f :k] :!Cp]

                 ;autocomplete
                 :homerow [:semicolon :!Tspacebar] [:return_or_enter :!Creturn_or_enter]]}

        {:des "apps"
         :rules [:homerow
                 ;alfred
                 [:a :!Ospacebar]]}

        {:des "colemak"
         :rules [[:##e :f]
                 [:##r :p]
                 [:##t :g]
                 [:##y :j]
                 [:##u :l]
                 [:##i :u]
                 [:##o :y]
                 [:##p :semicolon]
                 [:##s :r]
                 [:##d :s]
                 [:##f :t]
                 [:##g :d]
                 [:##j :n]
                 [:##k :e]
                 [:##l :i]
                 [:##semicolon :o]
                 [:##n :k]]}]}

    ;; !  | means mandatory
    ;; #  | means optional
    ;; C  | left_command
    ;; T  | left_control
    ;; O  | left_option
    ;; S  | left_shift
    ;; F  | fn
    ;; Q  | right_command
    ;; W  | right_control
    ;; E  | right_option
    ;; R  | right_shift
    ;; !! | mandatory command + control + optional + shift (hyper)
    ;; ## | optional any
```
