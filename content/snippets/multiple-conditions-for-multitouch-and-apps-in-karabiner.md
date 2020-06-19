---
slug: multiple-conditions-for-multitouch-and-apps-in-karabiner
title: Multiple Conditions for Multitouch and Apps in Karabiner
date: 2020-06-19 15:06
published: true
category: ['']
---
```clojure
 {:des "multitouch"
         :rules [:multitouch_extension_finger_count_total
                 [:a {:pkey :button1 :modi :left_option}]
                 [:s :button2]

                 [:d {:pkey :button1 :modi :left_shift}]
                 ;Allow "a" to be left_option in other apps
                 [:##f :button1]
                 [:g {:pkey :button1 :modi :left_command}]

                 [:z :!Cz]
                 [:x :!Cx]
                 [:c :!Cc]
                 [:v [:button1 :!Cv]]

                 ;multitouch in Ableton
                 [:condi :Ableton :multitouch_extension_finger_count_total]
                 [:q [:button1 :delete_or_backspace]]

                 [:w :!COp]
                 [:e :!Stab]

                 [:a :left_option]

                 ;multitouch in VSCode
                 [:condi :code :multitouch_extension_finger_count_total]
                 [:q [:button1 :!CSk]]

                 ;multitouch in Screenflow
                 [:condi :Screenflow :multitouch_extension_finger_count_total]
                 [:d [{:pkey :button1 :modi :left_shift} :!Cdelete_or_backspace]]


                 ;
                 ]}
```




