---
slug: build-a-lens-from-scratch
title: Build a Lens From Scratch
date: 2019-01-16
published: true
---

Let's take a backwards approach to dive into lenses by starting with our final implementation. What you see below is what we want our api to look like. We want `prop` to be a lens which can focus on a property and we want `view` to use the lens to focus onto the `person` (or any other object we pass in as the second parameter). At first glance, this will probably look confusing, but the trick is pretty easy to explain.

```js
let person = {
  name: 'John',
}

let john = view(prop('name'), person)
```

# Implement a View Operator and Prop Lens

So from our code above, we know the `view` and `prop` functions will look something like below where:

1. `view` takes a `lens` and `object`

2. `prop` takes a `key`

```js
let view = (lens, object) => {
  return 'something'
}

let prop = key => {
  return 'something'
}
```

This is where we really start scratching our heads 🤔 ...

How can the `lens` possibly get the value off of the `object`??? The lens is not a `key`, it is an invoked function that takes a `key`! So the only solution here is that the `lens` _is_ a function which means that `prop` , when invoked with a `key` , returns a function!

```js
let view = (lens, object) => {
  //`lens` is now a function
  return 'something'
}

let prop = key => {
  //we're returning a function
  return () => {
    return 'something'
  }
}
```

# Connect the Functions

Now that our `lens` is a function, we can invoke our `lens` with the object:

```js
let view = (lens, object) => {
  //pass the object into the lens
  return lens(object)
}
```

Our `prop` function now has access to the `object` and we already have the `key` so the implement is as simple as using the `key` on the `object`

```js
let prop = key => {
  return object => {
    return object[key]
  }
}
```

# All Together Now

```js
let person = {
  name: 'John',
}

let view = (lens, object) => {
  return lens(object)
}

let prop = key => {
  return object => {
    return object[key]
  }
}

let john = view(prop('name'), person)

console.log(john) //logs "John"
```

# Build a `set` Operation

Take another look at our `prop` function. So far, it's really great at getting a value, but provides no way to `set` a value:

```js
let prop = key => {
  return object => {
    return object[key] //get the value... but no way to set???
  }
}
```

So let's name our get feature and return it as the first step in our refactor:

```js
let prop = key => {
  //same as above, just named
  let propGetter = object => {
    return object[key]
  }

  return propGetter
}
```

A setter function is only going to take the new `value` and the `object` it will set the property on. We already have the `key`, so we can use object spread to create the new object and assign the property to the `value`:

```js
let prop = key => {
  let propGetter = object => {
    return object[key]
  }

  //return an object with the old object's properties and the new key/value
  let propSetter = (value, object) => {
    return { ...object, [key]: value }
  }

  //Um, you forgot something. Where's the setter?
  return propGetter
}
```

So we have a perfectly valid `propSetter` function, but no way to use it... How can we possibly returns a `getter` and a `setter` function? By passing them in another function of course 😘

In fact, this `lens` represents the core behavior of what a lens can do:

> A `lens` is a function acting as a getter and setter

```js
let lens = (getter, setter) => {
  //we now have the getter and setter
  return 'something'
}

let prop = key => {
  let propGetter = object => {
    return object[key]
  }

  let propSetter = (value, object) => {
    return { ...object, [key]: value }
  }

  return lens(propGetter, propSetter)
}
```

Ok, so we're stuck again. We have the `getter` and `setter` inside the lens, but what should `lens` return? Before, `prop` returned a getter function, but now we're returning an _invoked_ lens function... The answer, if you've picked up on the pattern, is to return a function!

```js
let lens = (getter, setter) => {
  return () => {
    return 'something'
  }
}
```

Since we're returning a function, I'm also going to rename our two uses to `lensFn`

```js
let lens = (getter, setter) => {
  //lensFn
  return () => {
    return 'something'
  }
}

let view = (lensFn, object) => {
  return lensFn(object)
}

let set = (lensFn, value, object) => {
  return lensFn(value, object)
}
```

At this point, we've coded ourselves into a corner. Our `lensFn` has been invoked two different ways:

1. `lensFn(object)`
2. `lensFn(value, object)`

So our first instinct at this point should be to introduce another function 😁

We'll call this a `transformer` because we want it to define what we do with our `getter`:

```js
let lens = (getter, setter) => {
  //hmm, how do we use the setter?
  return (transformer, object) => {
    let value = getter(object)
    let newValue = transformer(value)

    return newValue
  }
}

let view = (lensFn, object) => {
  //view lets the value pass through untouched. No changes!
  let transformer = value => value //pass through the value from the getter
  return lensFn(transformer, object)
}

let set = (lensFn, value, object) => {
  //hmm, what should we do withe the `value` arg?
  let transformer = () => 'something'
  return lensFn(transformer, object)
}
```

# Bring On the Applicator!

We're still left trying to figure out how a `setter` and a `getter` work together. Well do I have a surprise for you... Another function! 🎉

We'll call this one `"applicator"` because it defines how we "apply" a `setter` to the new value returned from the `transformer` / getter :

```js
let lens = (getter, setter) => {
  return (applicator, transformer, object) => {
    let value = getter(object)
    let newValue = transformer(value)

    //applies the setter to the value
    return applicator(setter, newValue)
  }
}

//view ignores the setter, no change with the transformer
let view = (lensFn, object) => {
  //define _how_ we apply the setter to the value
  let applicator = (setter, value) => value //ignore the setter
  let transformer = value => value //the `value` from the getter
  return lensFn(applicator, transformer, object)
}

//set applies the setter, uses the value arg for the transformer
let set = (lensFn, value, object) => {
  let applicator = (setter, value) => setter(value) //apply the setter
  let transformer = () => value //the `value` arg from above
  return lensFn(applicator, transformer, object)
}
```

# The Full Code

```js
let lens = (getter, setter) => {
  return (applicator, transformer, object) => {
    let value = getter(object)
    let newValue = transformer(value)

    return applicator(setter, newValue)
  }
}

//view ignores the setter, no change with the transformer
let view = (lensFn, object) => {
  let applicator = (setter, value) => value //ignore the setter
  let transformer = value => value //the `value` from the getter
  return lensFn(applicator, transformer, object)
}

//set applies the setter, uses the value arg for the transformer
let set = (lensFn, value, object) => {
  let applicator = (setter, value) => setter(value) //apply the setter
  let transformer = () => value //the `value` arg from above
  return lensFn(applicator, transformer, object)
}

let prop = key => {
  let propGetter = object => {
    return object[key]
  }

  let propSetter = (value, object) => {
    return { ...object, [key]: value }
  }

  return lens(propGetter, propSetter)
}

let person = {
  name: 'John',
}

let john = view(prop('name'), person)
console.log(john)

let mindyPerson = set(prop('name'), 'Mindy', person)
console.log(mindyPerson)
```

# Easily Implement `over`

Over is an operation that takes a function, instead of a value like `set` does, that should be used to transform value from the getter. So this is as easy as extracting the `transformer` out into an argument that we can pass in:

```js
//pass in the transformer
let over = (lensFn, transformer, object) => {
  let applicator = (setter, value) => setter(value) //apply the setter
  return lensFn(applicator, transformer, object)
}

let uppercaseJohnPerson = over(
  prop('name'),
  //our custom transformer
  string => string.toUpperCase(),
  person,
)

console.log(uppercaseJohnPerson)
```

# Prove It!

Think you understand lenses? Re-implement the `view`, `set`, and `over` operations below.

⚠️ **Extra challenge**: Implement a `has` operation which checks if a property exists at the specified lens

[https://codesandbox.io/embed/7jk4q988lj?module=%2Fsrc%2Findex.js&view=editor](https://codesandbox.io/embed/7jk4q988lj?module=%2Fsrc%2Findex.js&view=editor)
