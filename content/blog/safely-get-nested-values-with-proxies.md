---
slug: safely-get-nested-values-with-proxies
title: Safely Get Nested Values with Proxies
date: 2019-01-10
published: true
---

We've all been in the situation where we are trying to access a very deeply nested property inside of an object but it errors out because one of those properties you're trying to access is undefined.

```js
let person = {}

person.name.first
//Uncaught TypeError: Cannot read property 'first' of undefined
```

# Strings to the Rescue!

Many of us turn to a tool called lodash which has a get method just safely access properties by using strings and if the property isn't there you can set a default for it to return:

```js
import { get } from 'lodash'
let person = {}

let first = get(person, 'name.first')
console.log(first) //logs "undefined"
```

# But I Don't Like Strings...

We can flip the script by using a `Proxy` to hijack all of the `get` calls to allow us to attempt to access the property using "dots" as were used to rather than using strings:

```js
let person = {}

let handler = {
  get() {
    return new Proxy({}, handler)
  },
}

person = new Proxy(person, handler)
console.log(person.name.first)
//logs `Proxy{}`, but no Errors about an undefined "name"!
```

Unfortunately, with this approach, we've broken basic access to any properties on the object even if they _do_ exist:

```js
let person = {
  name: {
    first: 'John',
  },
}

let handler = {
  get() {
    return new Proxy({}, handler)
  },
}

person = new Proxy(person, handler)
console.log(person.name.first)
//logs `Proxy{}` even though "first" is defined :(
```

So let's go ahead and add in the happy path in our `handler` to `get` access to the property we're looking for by checking the `target` and `prop`:

```js
let handler = {
  get(target, prop) {
    if (target[prop]) {
      return target[prop]
    }
    return new Proxy({}, handler)
  },
}
```

So now our code will happily log out appropriate values and ignore any `undefined` values with a `Proxy`:

```js
let person = {
  name: {
    first: 'John',
  },
}

let handler = {
  get(target, prop) {
    if (target[prop]) {
      return target[prop]
    }
    return new Proxy({}, handler)
  },
}

person = new Proxy(person, handler)
console.log(person.name.first) //logs "John"
console.log(person.contact.email.provider) //logs `Proxy{}`
```

But... we can break this easily by adding a `contact` object to our `person:`

```js
let person = {
  name: {
    first: 'John',
  },
  contact: {},
}

//...

console.log(person.contact.email.provider)
//Uncaught TypeError: Cannot read property 'provider' of undefined
```

Our happy path scenario didn't cover when you start on a happy path, but then break out into a sad path. So let's finish off by covering when a nested object has `undefined` values:

```js
let handler = {
  get(target, prop) {
    let value = target[prop]
    if (value) {
      if (typeof value === 'object') {
        return new Proxy(value, handler)
      }

      return value
    }
    return new Proxy({}, handler)
  },
}

//...

console.log(person.name.first) //logs "John"
console.log(person.contact.email.provider) //logs `new Proxy`
```

Now we're back to our error-free approach and we can even add in some neat debugging features!

```js
let handler = {
  get(target, prop) {
    let value = target[prop]
    console.log(`${prop} is ${value}`) //Log access to this prop
    if (value) {
      if (typeof value === 'object') {
        return new Proxy(value, handler)
      }

      return value
    }
    return new Proxy({}, handler)
  },
}

// --- Logs ---
// name is [object Object]
// first is John
// contact is [object Object]
// email is undefined
// provider is undefined
```

# A Flawed Solution, But There's More...

I'll be the first to admit getting a value of `Proxy` when you're supposed to get an `undefined` will probably screw up a few things in your app. _But_ this does open the door for us to make some really interesting tools with `Proxy` while keeping a slick API that avoids strings. Stay tuned for more... 😉

# Prove It!

Think you understand how to use the `handler.get` API? Write a `handler.get` that always returns `"John"` when accessing any index of an Array:

[https://codesandbox.io/embed/o52jlrvjwy?view=editor](https://codesandbox.io/embed/o52jlrvjwy?view=editor)
