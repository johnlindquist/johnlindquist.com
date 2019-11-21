---
slug: simplifying-mergemap
title: Simplifying  mergeMap in RxJS
date: 2019-09-26 08:09
published: true
---

## What Does `mergeMap` Do?

Let's take the example of "click to start a timeout". In vanilla JavaScript,
you would write it like this:

```js
document.addEventListener("click", event => {
  setTimeout(() => {
    console.log("timeout")
  }, 1000)
})
```

If you understand that, you can understand `mergeMap`. `mergeMap` starts
with source #1 (the document clicks) then inside the callback, starts 
source #2 (the timeout). The reason `mergeMap` can be confusing in RxJS is
due to the APIs that wrap around those behaviors. RxJS is a pattern that
follows rules on how sources talk to each other which makes your code flexible and expressive
at the cost of mental overhead of learning the patterns.

## Refactoring to Functions

Let's explore `mergeMap` by refactoring the above example into an
RxJS API. First, wrap source #1 (the document clicks) in a function that
receives a callback:

```js
const source1 = callback => {
  document.addEventListener("click", callback)
}
```

Now invoke source1 with the exact same callback as our first example:

```js
source1(event => {
  setTimeout(() => {
    console.log("timeout")
  }, 1000)
})
```

This has the same behavior as the code above. The only change is that
we've wrapped our `addEventListener` in a function. So let's do the same by
wrapping our `setTimeout` in a function:

```js
const source2 = callback => {
  setTimeout(callback, 1000)
}
```

With both `source1` and `source2` defined as functions, we can express our example
like so:

```js
source1(event => {
  source2(() => {
    console.log("timeout")
  })
})
```

## Making a `mergeMap` Operator

Time for some copy/paste! Grab the entire previous block of code
and drop it inside a function called `mergeMap`:


```js
const mergeMap = /* But what goes here? */ => {
  source1(event => {
    source2(() => {
      console.log("timeout")
    })
  })
}
```

Looking at the above example, you'll see that we need to make 2 things into
arguments of our `mergeMap` function:

1. `source1`
2. `source2`

So let's add them in like so:

```js
const mergeMap = (source1, source2) => {
  source1(event => {
    source2(() => {
      console.log("timeout") //AH, I'M TRAPPED!
    })
  })
}
```

You'll notice there's one more thing trapped inside our function: the callback!
We definitely want to be able to customize the callback, so let's pull that out
too:

```js
const mergeMap = (source1, source2, callback) => {
  source1(event => {
    source2(callback)
  })
}
```

Using our new `mergeMap` function would look like this:

```js
mergeMap(source1, source2, () => {
  console.log("timeout")
})
```

This is _NOT_ the RxJS API you might be familiar with, but we're almost there.

## Customizing the Second Source

Looking back at our implementation so far, you'll see that we left a callback
implementation (the one that sets up source #2) locked inside our function.

```js
const mergeMap = (source1, source2, callback) => {
  source1(event => { 
    source2(callback) //What about this behavior?
  })
}
```

Let's extract that as well:


```js
const mergeMap = (source1, customize, callback) => {
  source1(event => {
    const custom = customize(event)
    custom(callback)
  })
}
```

And the implementation:

```js
mergeMap(
  source1,
  event => source2,
  () => {
    console.log("timeout")
  }
)
```

Now we have all the pieces in place. `mergeMap` is expressed in a way that
we can pass in `source1`, customize how `source2` is made, and then pass in
the `callback` to `source2`.

## Refactoring to an RxJS API

RxJS uses `pipe` and `subscribe` instead of invoking functions like we did above.
The example above written in RxJS would look something like this:

```js
source1.pipe(mergeMap(event => source2)).subscribe(()=>{
  console.log("timeout")
})
```

We can definitely add in this API to our current setup. So keep that codeblock above
in mind as we do the following refactors.

## Creating a New Source

In RxJS, Operators _ALWAYS_ return a new source. In our simple implementation, 
a "source" can be defined as a function with a callback argument. This refactor
is pretty straight-forward. We move the callback from the last argument to
instead be the first argument of a returned function. That's a lot of words
to say that you're doing this:

```js
//before
const mergeMap = (source1, customize, callback) => {
//after
const mergeMap = (source1, customize) => callback => {
```

That syntax might be unfamiliar, so let's soften the impact and name our `newSource`:

```js
const mergeMap = (source1, customize) => {
  const newSource = callback => {
    source1(event => {
      const custom = customize(event)
      custom(callback)
    })
  }

  return newSource
}
```

Using `mergeMap` now looks like this:
```js
const newSource = mergeMap(source1, source2)

newSource(() => {
  console.log("timeout")
})
```

## Adding `subscribe`

Now we can tack on a `.subscribe` by having it reference itself. Remember, in
our demo, calling the source function is the same as calling `subscribe`. So
to make it match RxJS's API, we'll do something a little silly:

```js
newSource.subscribe = newSource
```

Yes, we're making a property on a function reference the function itself. Kinda dumb,
but the goal is to match an API, not be smart:

```js
const newSource = mergeMap(source1, source2)
newSource.subscribe = newSource

newSource.subscribe(() => {
  console.log("timeout")
})
```

## Adding a `.pipe` Function

RxJS uses a fluent API, so our sources need the `.pipe` function attached to
them. We'll first define `pipe`:

```js
const pipe = function(fn) {
  return fn(this)
}
```

Then we can attach our pipe to any/all of the sources:

```js
source1.pipe = pipe
```

With `.pipe` attached to a source, `pipe` is expecting a `fn` that
will receive the source, so we have to re-arrange the arguments of `mergeMap`
to support that:

```js
//before
const mergeMap = (source1, customize) => {

//after
const mergeMap = customize => source1 => {
```

Again, if the curry syntax is unfamiliar, we can write it out long-hand. Our `fn`
will have to wrap all the `newSource` behavior from before:

```js
const mergeMap = customize => {
  const fn = source1 => {
    const newSource = callback => {
      source1(event => {
        const custom = customize(event)
        custom(callback)
      })
    }

    return newSource
  }
  return fn
}
```

Once you've become more accustomed to currying arguments, the following is
the exact same code as above. Whether it's "more readable" is in the eye of
the beholder. It's definitely much shorter:

```js
const mergeMap = customize => source1 => callback =>
  source1(event => {
    const custom = customize(event)
    custom(callback)
  })
```

With `mergeMap` refactored, we've matched the API of RxJS:

```js
const newSource = source1.pipe(mergeMap(event => source2))
newSource.subscribe = newSource

newSource.subscribe(() => {
  console.log("timeout")
})
```

## Functions as Building Blocks

It's fun to see what we can write with "just functions", so let's remove all the RxJS
properties we added and only use our functions.

Let's compare the original:

```js
document.addEventListener("click", event => {
  setTimeout(() => {
    console.log("timeout")
  }, 1000)
})
```

To our new batch of functions:

```js
const source1 = callback => {
  document.addEventListener("click", callback)
}

const source2 = callback => {
  setTimeout(callback, 1000)
}

const mergeMap = customize => source1 => callback =>
  source1(event => {
    const custom = customize(event)
    custom(callback)
  })

const mergeSource2 = mergeMap(event => source2)

const newSource = mergeSource2(source1)

newSource(() => {
  console.log("timeout")
})
```


We took the time to separate each piece of the original into reusable functions. 
This approach enables us to use functions as building blocks of functionality
and build even more features around them. RxJS is a library that defines
patterns around these functions so they can all interoperate, but that
doesn't mean you're stuck doing things the RxJS-way. All the concepts in
RxJS can be expressed in functions that you can dig into yourself.


<Codesandbox slug="github/johnlindquist/observer-pattern/tree/mergeMap" module="/src/index.js" console/>


### Endnotes:

I know RxJS has more features than my trivial explanation and example including unsubscribe/complete,
errors, scheduling, etc.
The RxJS contributors have done incredible, inspirational work on the project.
I also think stripping away all the features and approaching them from the
ground up is great teaching tool.
