---
slug: your-first-javascript-proxy
date: 2019-01-06
title: 'Your First JavaScript Proxy'
description: 'Learn how to create your first Proxy in JavaScript'
categories: ['javascript']
keywords: ['javascript', 'proxy']
published: true
---

A `Proxy` is a fancy word for intercepting how you interact with objects in JavaScript. Want to hi-jack what happens when you set a value? Care to log out every time you call a function? All this and much more can be done by wrapping your object in a `Proxy` and "handling" those interactions.

# `console.log` When They're Changed with `handler.set`

First we'll create a simple object:

```js
let person = { name: 'John' }
```

If I change the name to `Mindy`, if I want to capture the change to see the value before and after it changes, I have to do it _around_ setting the value.

```js
console.log(person.name)
person.name = 'Mindy'
console.log(person.name)
```

A `Proxy` will let me intercept when the value is `set` by using a `handler` with a `set` function:

```js
let handler = {
  set(target, property, value) {
    //target is the original `person`
    //property is the `name` property
    //value would be "Mindy"
  },
}
```

`set` is called a "trap". A "trap" is a function that intercepts the original behavior and allows you to re-write any behavior you would like.

The implementation of `set` is simply logging out the old `target[property]` then logging out the new `value`

```js
let handler = {
  set(target, prop, value) {
    //log out what's changing
    console.log(`Changing from ${target[prop]} to ${value}`)

    //actually change it
    return (target[prop] = value)
  },
}
```

So now we can drop our `person` and `handler` into a `new Proxy` and everything will be wired up:

```js
person = new Proxy(person, handler)
```

Now, when we change the `name`, the console will log out the change:

```js
person.name = 'Mindy'
//console logs out "Changing from John to Mindy"
```

# Prove it!

Here's a codesandbox for you to prove you understand how the `set` trap works. Implement `set` in the handler so that it logs out "Changing from John to Mindy" when `[person.name](http://person.name)` is set to "Mindy".

[https://codesandbox.io/embed/k9jzzy043r?module=%2Fsrc%2Findex.js&view=editor](https://codesandbox.io/embed/k9jzzy043r?module=%2Fsrc%2Findex.js&view=editor)

# Notes

`Reflect.set` is the proper tool for setting values inside of `Proxy` set traps, but makes no noticeable difference in this demo and was left out to avoid any confusion. We'll cover more about `Reflect` in future posts.
