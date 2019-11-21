---
slug: focused
title: Focused - Putting Proxies to Work
date: 2019-01-11
published: true
---

# Focused

With the power of our new proxy knowledge in hand, let’s turn to a library that leverages proxies behind the scenes. [Focused](https://github.com/yelouafi/focused) is a library that uses similar techniques to get properties using proxies which allows us to do somewhat magical operations on deeply nested state.

It’s worth noting that we will no longer be getting in setting the properties directly, instead we will be combining functions with our proxies to allow us to attack a plethora of use cases.

First, install `focused`

```bash
    npm i focused
```

We'll start with a basic `person`:

```js
let person = {
  name: 'John',
}
```

Now we can start building out our functions to manipulate our `person`:

```js
import { lensProxy, set } from 'focused'

let person = {
  name: 'John',
}

let name = lensProxy().name
let mindyify = set(name, 'Mindy')
let mindy = mindyify(person)

console.log(mindy)
```

1. Notice how the `lensProxy` allows us to access a property, `name`, that doesn't exist yet.

2. Then `set` is a function that acts on that property and uses the second value, `"Mindy"` as the value to set to. Passing in only to values to `set` returns a function expecting the "state".

3. We now have a `mindyify` function that can change the `name` of any object to `"Mindy"`.

Note: This creates a new object with the new `name` property. The previous `person` is left untouched.

# Try It Out!

Create any object with a `name` property and `mindyify` it!

[https://codesandbox.io/embed/qx01vlnp9j?view=editor](https://codesandbox.io/embed/qx01vlnp9j?view=editor)

# A Deeply Nested `set`

Let's update our code to have more nesting in our state:

```js
let state = {
  people: [
    {
      name: {
        first: 'John',
      },
    },
  ],
}
```

So how are we going to dig all the way into the state to `set` the `first` property? Easy!

```js
let first = lensProxy().people[0].name.first
```

All together now:

```js
import { lensProxy, set } from 'focused'

let state = {
  people: [
    {
      name: {
        first: 'John',
      },
    },
  ],
}

let first = lensProxy().people[0].name.first
let mindyify = set(first, 'Mindy')
let mindyiedState = mindyify(state)

console.log(mindyiedState)
//Logs out an Object with {people:[{name: {first: "Mindy"}}]}
```

So far, this is really neat, but we're locked in by that `people[0]` to only be able to access the first value in the `people` array. But fear not! Our `lensProxy` provides us with a special `$` function which allows us to pass in functions that can traverse all the values!

```js
import { lensProxy, set, each } from 'focused'
let first = lensProxy().people.$(each).name.first
```

So now, we're able to update _all_ `first` properties to `"Mindy"`:

```js
import { lensProxy, set, each } from 'focused'

let state = {
  people: [
    {
      name: {
        first: 'John',
      },
    },
    {
      name: {
        first: 'Ben',
      },
    },
  ],
}

let first = lensProxy().people.$(each).name.first
let mindyify = set(first, 'Mindy')
let mindyiedState = mindyify(state)

console.log(mindyiedState)
```

It's difficult to represent data structures much bigger than this in a blog post, but I'm sure you can imagine some deeply nested data sets where this could really help out. But as one last step, let's refactor a bit to reinforce what we've learned and add an `age` property and functions for zeroing out each `age`:

```js
import { lensProxy, set, each } from 'focused'

let state = {
  people: [
    {
      name: {
        first: 'John'
      }
      age: 37
    },
    {
      name: {
        first: 'Ben',
      },
      age: 12
    }
  ]
}

let _ = lensProxy() //only need to call once

let setEachFirst = set(_.people.$(each).name.first)
let setEachAge = set(_.people.$(each).age)

let mindyify = setEachFirst('Mindy')
let zeroEachAge = setEachAge(0)

let mindyiedState = mindyify(state)
console.log(mindyiedState)

let zeroedMindy = zeroEachAge(mindyiedState)
console.log(zeroedMindy)
```

# Oh, So _That's_ a Lens!

You've just used multiple lenses! Anything you've created with a `lensProxy`
like `_.people.$(each).name.first` is a "lens" which will focus on a property inside of a function. A lens works with functions, like `set` and many others, to manipulate those properties.

# Prove It!

Create a `last` property on each person, then write a lens and a `set` function to change all the `last` names to `"Lindquist":`

[https://codesandbox.io/embed/mo8znzwz5j?module=%2Fsrc%2Findex.js&view=editor](https://codesandbox.io/embed/mo8znzwz5j?module=%2Fsrc%2Findex.js&view=editor)
