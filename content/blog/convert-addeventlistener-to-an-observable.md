---
slug: convert-addeventlistener-to-an-observable
title: Convert AddEventListener to an Observable
date: 2019-03-20 09:03
published: false
---

[https://codesandbox.io/embed/7jk4q988lj?module=%2Fsrc%2Findex.js&view=editor](https://codesandbox.io/embed/7jk4q988lj?module=%2Fsrc%2Findex.js&view=editor)

Compare: addEventListener, setTimeout, promises
Compare: fromEvent, timeout, fromPromise

Wrapping Callbacks
my1yo4plq8

Wrapping Observers
82ny754px2

RxJS api

Passthrough
ry1kvv9ljn

Observers Re-wiring (using complete inside of next)
vj06l1wrv3

Producer vs Operator
6wyl059kyn

Basic addEventListener
r5joy73rv4

Extract the Handler
n96lvpjjr4

Wrap the Setup in a Function
r0vw4ymrqo

Unsubscribe
18ywm88lo4

fromEvent
82l9onw2k9

Interval
zqvokqp7zm

fromArray
kmynq3r927

zip
24mlpvoyj

merge
2z28qkxkvp

delay
3qx854m6r6

tap
l7jrp5qmlm

functional operator
nr5y0mmpop

rxjs api subscribe
10o5v19y3q

rxjs api pipe
8zz6o03qxj

rxjs map operator
5xr6vwoxon

pipe reduce
jvvp0m10j9

observer next
ypqqv5v5ox

complete (Subscription)
x24o37n5rw

complete remix
p98r8yky3j

error

scan
qzrlqmql66

concat
lx06v454wq

mergeMap
7mnwj4pmj0

switchMap
43olpyyo79

ajax
m44wmjzn28

ajax switchMap
k59z4p3v4v

debounceTime
p9m8llrprq

takeUntil
ykvpy67yrz

Operator signature
const operator = config => observable => create(observer => {

})
