---
slug: use-reflect-apis-with-proxy-handlers
date: 2019-01-08
title: 'Use Reflect APIs with Proxy Handlers'
description: 'Learn how to use Reflect APIs with Proxy Handlers'
categories: ['javascript']
keywords: ['javascript', 'proxy', 'reflect']
published: true
---

You'll notice something strange when you compare the `Reflect` API and the `handler` API for Proxies:

| Reflect API                        | handler API                        |
| ---------------------------------- | ---------------------------------- |
| Reflect.apply()                    | handler.apply()                    |
| Reflect.construct()                | handler.construct()                |
| Reflect.defineProperty()           | handler.defineProperty()           |
| Reflect.deleteProperty()           | handler.deleteProperty()           |
| Reflect.enumerate()                | handler.enumerate()                |
| Reflect.get()                      | handler.get()                      |
| Reflect.getOwnPropertyDescriptor() | handler.getOwnPropertyDescriptor() |
| Reflect.getPrototypeOf()           | handler.getPrototypeOf()           |
| Reflect.has()                      | handler.has()                      |
| Reflect.isExtensible()             | handler.isExtensible()             |
| Reflect.ownKeys()                  | handler.ownKeys()                  |
| Reflect.preventExtensions()        | handler.preventExtensions()        |
| Reflect.set()                      | handler.set()                      |
| Reflect.setPrototypeOf()           | handler.setPrototypeOf()           |

Yup, they have the _exact_ same API! First, let's look at `Reflect.set`:

```js
let person = {}

Reflect.set(person, 'name', 'John')

console.log(person.name)
//logs out "John"
```

This raises the question: "Why would I ever `Reflect.set` when I could just assign `person.name = "John"`? The answer comes from trying an attempting an assignment that might fail:

```js
'use strict'
let person = {}

Object.seal(person) //"seal" prevents adding properties

person.name = 'John'
//TypeError: Cannot add property name, object is not extensible
```

Errors are bad. We don't want errors. So how would we avoid an Error when we know it's going to fail? By using `Reflect.set`:

```js
let person = {}

Object.seal(person)

Reflect.set(person, 'name', 'John')

console.log(person.name)
//logs out `undefined` without an Error
//because `Reflect.set` didn't add the property!
```

# `Reflect.set` returns a `Boolean`

This time, we've attempted to set a property to a value, but our App hasn't blown up on us! As a sweet bonus, calling `Reflect.set` returns a `true` or `false` based on whether or not the `set` was successful:

```js
let person = {}

Object.seal(person)

let didItWork = Reflect.set(person, 'age', 37)

if (didItWork) {
  console.log('Everything is fine')
} else {
  console.log('Something prevented the assignment')
}
```

This pairs _perfectly_ with our `handler.set` because we need to return whether or not the assignment worked from our `handler.set` call:

```js
let person = {}

Object.seal(person)

let handler = {
  set(target, property, value) {
    let didItWork = Reflect.set(target, property, value)

    if (!didItWork) {
      console.log(`You're trying to add "${property}"" to a sealed Object`)
    }
    return true
  },
}

person = new Proxy(person, handler)

person.name = 'John'

console.log(person.age)
//logs `undefined`, no Errors!
```

In you `handler.set`, if you return `true`, then you're Error-free. Anything that returns `false` will trigger a `TypeError`, so you could mimic a `freeze` behavior in your `handler` by always returning `false`:

```js
let person = {}

let handler = {
  set() {
    return false
  },
}

person = new Proxy(person, handler)

person.name = 'John'

console.log(person.age)
//TypeError: 'set' on proxy: trap returned falsish for property 'name'
```

Thinking about it from the opposite angle, you could replicate a default Object set behavior by assigning `handler.set` to `Reflect.set`

```js
let person = {}

let handler = {
  //this is essentially a "pass-through" behavior
  set: Reflect.set,
}

person = new Proxy(person, handler)

person.name = 'John'

console.log(person.name)
//logs "John"
```

The `handler` APIs and the `Reflect` APIs are meant for each other both figuratively and literally.

# Prove It!

Think you understand? Try implementing a `handler.set` that always sets both a `name` _and_ a `firstName` property whenever someone tries to assign the `name`:

[https://codesandbox.io/embed/ypwxp7pmr9?module=%2Fsrc%2Findex.js&view=editor](https://codesandbox.io/embed/ypwxp7pmr9?module=%2Fsrc%2Findex.js&view=editor)
