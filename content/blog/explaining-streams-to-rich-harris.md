---
slug: explaining-streams-to-rich-harris
title: Explaining Streams to Rich Harris
date: 2019-09-05 11:45
published: true
---

_Before we begin, I'm intentionally avoiding loaded words found in stream libraries. 
If you're familiar with another library already, try and spot where the concepts align._

Hi Rich! 👋

#### 1. Start with an `addEventListener`

```js
document.addEventListener("click", event => {
  console.log(event)
})
```

Believe it or not, we're almost done...

#### 2. Extract the `callback`

```js
const callback = event => {
  console.log(event)
}

document.addEventListener("click", callback)
```

Getting closer...

#### 3. Wrap the Setup in a Function (so you can start it later)

```js
const setup = cb => {
  document.addEventListener("click", cb)
}

const callback = event => {
  console.log(event)
}

setup(callback) //now you gotta call `setup` for anything to run
```

I can smell the finish line.....

#### 4. Wrap the Callback to Change Behavior
```js
const setup = cb => {
  document.addEventListener("click", cb)
}

const callback = event => {
  console.log(event)
}

//A sweet util for overriding the callback behavior
const pluckX = originalCallback => {
  const newCallback = event => {
    originalCallback(event.x)
  }

  return newCallback
}

setup(pluckX(callback))
```

We've made it! 🏆


## I Thought This Was Supposed to Be Hard...

Rich, new patterns often drive people away because they're so comfy with their old patterns. But once a pattern becomes familiar,
brains will start to see them everywhere! /insert "Everything is a Stream" zen dog pic 😂

That being said, let's dive into the patterns:

#### 1. Sources Need an API

Consider how different Web APIs are when working with our async tools:

* `addEventListener` returns `undefined`
* `setInterval` returns an id 
* Promises return a promise instance

I mean, c'mon, who designed these APIs? Let's do something about it! We'll start by wrapping an API around `addEventListener`.
We'll call these object with APIs a "source". So far, the only method on our API is `setup`:

```js
const fromEvent = (eventType, target) => {
  return {
    setup: cb => {
      target.addEventListener(eventType, cb)
    }
  }
}
```

Now we can use our source like so:

```js
const clickStream = fromEvent("click", document)
clickStream.setup(event => console.log(event))
```

#### 2. A Consistent API!

Let's create a timer that will follow that same pattern. Wrap `setInterval` with an object that has a `setup` method:

```js
const timer = delay => {
  return {
    setup: cb => {
      let i = 0
      setInterval(()=>{cb(i++)}, delay)
    }
  }
}

const timerStream = timer(1000)
timerStream.setup(i => console.log(i))
```

You can follow this pattern for any other source of events, data, etc.

#### 3. Our API Has a Nesting Problem

Nested callbacks have a long, tormented history in JS. So let's see how streams approach the problem.
We'll revisit our `clickStream` and `timerStream`, but wait to start the timer until we click.
Here's how we're currently stuck doing it:

```js
const clickStream = fromEvent("click", document)
const timerStream = timer(1000)

//Our redirect behavior
clickStream.setup(event => {
  timerStream.setup(i => console.log(i))
})
```

This works fine, but its nested callbacks are showing 🙈. Let's make this more streamy.


#### 4. Changing Source Behavior with Wrappers

Here's a little wrapper "template" that shows how we'll approach our problem:

```js
const streamWrapper = source => {
  //return an object with a `setup` method to match the shape of our source
  return {
    setup: callback => {
      //define custom behavior here using the `source` API and `callback`
    }
  }
}
```

These functions are often called decorators/higher order functions/etc.
The key piece is that we can redefine how our source interacts with the callback.
To demonstrate, let's write a wrapper that invokes the `callback` twice:

```js
const streamWrapper = source => {
  return {
    setup: callback => {
      source.setup(value => {
        callback(value)
        callback(value)
      })
    }
  }
}

const clickStream = fromEvent("click", document)
streamWrapper(clickStream).setup(event => console.log(event))
```
<Codesandbox slug="blissful-forest-51kfl"/>


#### 5. But We Have Two Sources!

Yeah, I know. Chill, Rich. It's common to return a function to accept another source:

```js
const wrapper = source => otherSource => {
  return {
    setup: callback => {
      //define custom behavior, but now with multiple source options!!!      
    }
  }
}
```

Our "click then start timer" behavior looks like this:
```js
//Hey, look! It's our good friend "Nested Callback"
setup: callback => {
  //Ignore the `value` (a MouseEvent) for now. We could use it if needed
  source.setup(value => { 
    otherSource.setup(callback)
  })
}
```

So we can bring it all together in a wrapper that we'll aptly name `redirect`:
```js
const redirect = source => otherSource => {
  return {
    setup: callback => {
      source.setup(value => {
        otherSource.setup(callback)
      })
    }
  }
}

redirect(clickStream)(timerStream).setup(i => console.log(i))
```

<Codesandbox slug="friendly-hugle-j91zm"/>


#### 6. A Fluent API

To some functional programmers, the previous example looks totally normal, but many other JS devs prefer a fluent API. So let's support them (this is totally optional, but common).
We'll need to add a way for sources to pass themselves into our source wrapper functions. This common JS trick looks is implemented in this `thru` method:


```js
return {
  setup: cb => {
    target.addEventListener(eventType, cb)
  },
  thru(fn){ //not an arrow fn, we need `this`!
    return fn(this) //`this` is the source
  }
}
```  

Now using `thru` will enable of our wrapper functions will automatically receive the source. Compare the examples and pick your favorite (it's a personal preference, no wrong answer):

```js
//old example
redirect(clickStream)(timerStream).setup(i => console.log(i))

//new example with `thru`
clickStream.thru(redirect(timerStream)).setup(i => console.log(i))
```

Note, `thru` receives the main `source` *last*, so we do have to swap the order in our `redirect`:

```js
//before
const redirect = source => otherSource =>
//after
const redirect = otherSource => source =>
```

<Codesandbox slug="distracted-moser-guxkh"/>

_Sidenote: Many FP devs would argue I should have had the main source last in the first example (and I agree), but I thought it would have caused more confusion than necessary..._

🏆 We now have a consistent API which enables async sources to interoperate. Yay consistency! Yay interoperability!


#### Hey, John! You Keep Wrapping Callbacks to Override Their Behavior...

Good catch, Rich! That's exactly what we're doing! In fact, the foundation of Streams is passing in a callback
with your desired behavior, then overriding it with all the async stuff you need.


> 💡 _Pass in a callback with your desired behavior, then wrap it and override with your async functionality_

## All Good Things...

Hey, John. Your API is sorely lacking a way to remove events and stop timers. You're a big dummy!

Rich, that's not very nice. I was just waiting for the right moment to bring it up.

Let's add a consistent way of cleaning up our sources. The easiest way I can think of is to have our `setup`
return a function to `teardown`:

#### 1. Teardown Time

```js
//fromEvent
setup: callback => {
  target.addEventListener(eventType, callback)

  return () => { //returning a teardown function
    target.removeEventListener(eventType, callback)
  }
}
```

So now our api looks like the following:

```js
const clickStream = fromEvent("click", document)

const teardown = clickStream.setup(event => console.log(event))
/*
|￣￣￣￣￣ | 
|   THREE   | 
|   HOURS   | 
|   LATER...|
| ＿＿＿＿＿| 
(\__/) || 
(•ㅅ•) || 
/ 　 づ
*/
teardown() //haha, no clicky for you, Rich! That's what you get for calling me names.
```

🏆 Yay for Consisent APIs to clean up after ourselves

<Codesandbox slug="jolly-jennings-r818m"/>



#### 2. The Callback Bundle. `Done` is Better Than Perfect.
If you've seen a generator in JS, you know they emit `{value, done}`. So far, we're only emitted values. 
I can think of plenty of use cases where I want to know when timers, events, etc., stop.

It's a super important feature, so let's add it in by bundling a `done` callback with our main `callback`:

```js
//BEHOLD! An object with named callbacks
const bundle = {
  callback: event => console.log(event),
  done: () => console.log("done")
}
clickStream.setup(bundle)

//using our bundle
setup: bundle => {
  target.addEventListener(eventType, bundle.callback)

  return () => {
    target.removeEventListener(eventType, bundle.callback)
  }
}
```

...

...

John, I don't see `done` being used anywhere!

Rich, you're sharp as a tack!

We're going to use `done` by wrapping our setup function. That way, we can always `teardown` whenever `done` is called:


```js
export const setupWrapper = setup => bundle => {
  const teardown = setup({ //grab a ref to teardown
    done: () => {
      if (teardown) teardown() //invoke teardown whenever `done` is called
      if (bundle.done) bundle.done()
    },
    callback: bundle.callback //No custom behavior
  })

  return teardown
}
```

Now let's see it in action:

```js
setup: setupWrapper(bundle => {
  target.addEventListener(eventType, bundle.callback)

  return () => {
    target.removeEventListener(eventType, bundle.callback)
  }
})
```

John, wait a minute... You're still not invoking `done` anywhere. You just changed the behavior!

Dang, I was hoping you wouldn't notice. Fine, time for some sweet demo action. 
Remember how we made a behavior that invoked the `callback` twice? This time, we'll replace
the second call with a call to `done` which will stop our stream, notify us, and tear it down!

```js
//We'll pass our source thru this bad boy
const once = source => {
  return {
    setup: setupWrapper(bundle => {
      //implement our new behavior. Handle one click, then done.
      const newBundle = {
        callback: event => {
          bundle.callback(event)
          bundle.done()
        },
        done: bundle.done
      }
      return source.setup(newBundle)
    })
  }
}

const clickStream = fromEvent("click", document).thru(once)

const bundle = {
  callback: event => console.log(event),
  done: () => console.log("done...")
}
clickStream.setup(bundle)
```

<Codesandbox slug="ancient-snowflake-sknr4"/>


## With Our Patterns in Place, it's DEMO TIME!

(If you skipped to this section, shame on you! This won't make any sense!)

When you look at these util functions, you'll realize why most libraries pull them out into packages
so you don't have to look at their internals 😆

#### Combining Two Sources

<Codesandbox slug="recursing-fog-fscin"/>

#### Click to Start Timer, Keypress to Stop

<Codesandbox slug="recursing-cache-qmcqm"/>

#### Synchronize Two Sources

<Codesandbox slug="exciting-albattani-0rrwk"/>


While these demos are simple, the potential to combine, synchronize, start, stop (or all of the above!)
through a consistent API with any variety of source is very appealing.

--- 
#### Sidenote: Things I Intentionally Left Out

* I ignored "Subjects" because they're too often abused for simple use cases. 
They combine the source and bundle APIs, allow control over multiple bundles, and enable you to mess with callbacks that are often best used as internals.
That being said, they definitely have their place.

* Error handling works on the same concept as `done`. Catch your error and propogate is through the chain
of bundle calls.

* Libraries always ship a `create` util for sources. I intentionally left this out to keep in the repitition
for learning purposes.

* Sources can also be objects, arrays, etc. (I included one in the Synchronize demo). They're very simple and they don't teardown. I didn't mention them to avoid confusion.

* Scheduling is an advanced topic where you can manipulate timing. Incredibly powerful feature, yet too edge-case to dive into.
---




## TL;DR
1. Build a consistent API around a chaotic JS async ecosystem
2. Enable sources to interoperate
3. Wrap callbacks to override their behavior with new async abilities
4. Manages Nested Callbacks
5. Automatically handles cleanup when things complete


#### Every piece of your Stream framework follows simple rules
  * Source - setup/teardown
  * Bundles - a basic object with named callbacks/dones
  * Wrappers - wrap sources and bundles with desired behavior
  * SetupWrappers - Enforce teardown when done is called