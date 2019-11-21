---
slug: what-is-an-rxjs-subject
title: Subject in RxJS vs. Subject in the Observer Pattern
date: 2019-09-19 13:09
published: true
---

## The Observer Pattern had Subjects... 🤔

True, true, we've seen subjects [already](/what-is-the-observer-pattern-in-javascript).
But, in RxJS-land, Subjects are a combination of Observables and Observers! 🤯

So that means we need to combine our previous concept of a subject:

```js
const subject = {
  state: {
    message: "Hello"
  },
  observers:[],
  update(value){
    this.state = value
    this.observers.forEach(observer => {
      observer.notify()
    })
  }
}
```

with our new concept of an Observable and Observers:

```js
const createObservable = subscribe => {
  return {
    subscribe
  }
}

const observer = {
  next(value){
    console.log(`new value received`, value)
  }
}
```

Let's see how this all fits together

## Refactoring `createObservable` to `createSubject`

Since our `Subject` is an `Observable`, let's start with a `createSubject`
function that's _exactly_ the same as `createObservable`:

```js
const createSubject = subscribe => {
  return {
    subscribe
  }
}
```

To make our Subject an `observer`, we need to add a `next` method to
match up the API:

```js
const createSubject = subscribe => {
  return {
    subscribe,
    next(value) => {
      //???
    }
  }
}
```

Now we're a bit stuck... we need to call `next` on the `observer`
that's hidden away inside of the `subscribe` function. But how do
we access it?

The secret is to override the `subscribe` function with a new internal
`subscribe`:

```js
const createSubject = subscribe => {
  const internalSubscribe = observer => {
    //???
  }

  return {
    subscribe:internalSubscribe,
    next:(value) => {
      //???
    }
  }
}
```

Now we can yoink out the `observer` and use it inside of our `next`
method:

```js
const createSubject = subscribe => {
  let intervalObserver
  const internalSubscribe = observer => {
    intervalObserver = observer
  }

  return {
    subscribe: internalSubscribe,
    next: value => {
      intervalObserver.next(value)
    }
  }
}
```

> 💡 Re-wiring "pieces" (subscribe and observer) internally is the **Magic Sauce** of RxJS.
> You'll see this technique _everywhere_!


Finally, hook up the original `subscribe(observer)` so everything works again:

```js
const internalSubscribe = observer => {
    intervalObserver = observer
    subscribe(observer)
  }
```

With all the pieces put together, you can now invoke `subscribe` (just like an Observable!)
and `next` (just like an Observer!) 🎉



```js
const subject = createSubject(subscribe)
subject.subscribe(observer)

subject.next({ message: "Hello" })
```

<Codesandbox slug="github/johnlindquist/observer-pattern/tree/subject" module="/src/index.js" console/>

You'll notice above that if you click on the document, you'll still get
Mouse Events logged out. While this is a neat feature, it's not the role of a `Subject` 😬

## Removing Flexibility. Goodbye Custom `subscribe`

On Subjects, the `next` method is the only way we want to push through values.
We save events, timers, etc for Observables. This means we get to delete code! 🥳
So let's remove the option to pass in a `subscribe` function.

```js
//before
const createSubject = subscribe =>
//after
const createSubject = () =>
```

With `subscribe` function gone, the only purpose of our exposed `subscribe` API
is to grab the observer. So the body of `createSubject` simplifies to the following:

```js
const createSubject = () => {
  let intervalObserver

  return {
    subscribe: observer => {
      intervalObserver = observer
    },
    next: value => {
      intervalObserver.next(value)
    }
  }
}
```

Looking at the code above, you might be thinking, 
"John, this is way simpler than what we started with! Why did you take me on a roundabout course to get here?"

You are totally right, we could have just started with this, but I wanted to emphasize
that a Subject is both an Observable and Observer. So I lingered a little 🙂


<Codesandbox slug="github/johnlindquist/observer-pattern/tree/subject" module="/src/index.js" console/>

## Multiple Observers. The True Purpose of Subjects.

If you think back to the [Observer Pattern](/what-is-the-observer-pattern-in-javascript),
you'll remember that Subjects should notify an array of observers. But as you can see
in the demo below, _only_ the `twoObserver` is notified 🙁:


<Codesandbox slug="github/johnlindquist/observer-pattern/tree/multiple-observers" module="/src/index.js" console/>


The fix is to think back to the Observer Pattern and add an Array to the Subject
to keep track of all the observers:

```js
const createSubject = () => {
  let observers = []
```

Then, each time we receive a new observer through `subscribe`, we push it into the array:

```js
subscribe: observer => {
  observers.push(observer)
},
```

And each time we invoke `next`, we send the value to all the observers:

```js
next: value => {
  observers.forEach(observer => {
    observer.next(value)
  })
}
```

Our new and improved "multiple observers" `createSubject` in all of its glory:

```js
const createSubject = () => {
  let observers = []

  return {
    subscribe: observer => {
      observers.push(observer)
    },
    next: value => {
      observers.forEach(observer => {
        observer.next(value)
      })
    }
  }
}
```

<Codesandbox slug="github/johnlindquist/observer-pattern/tree/forEach" module="/src/index.js" console/>

## Unsubscribe

Our last feature to implement is `unsubscribe` or removing an observer from the Subject.
This will be very similar to how `unsubscribe` is implemented in Observables, but
instead of "stopping" an Observable, we'll be removing an observer from the Array:

A standard "remove an item from an Array in JavaScript" snippet will work just fine.
Luckily for us, we closed over the `observer`, so we still have a reference to it:

```js
subscribe: observer => {
  observers.push(observer)

  const unsubscribe = () => {
    const index = observers.indexOf(observer)
    observers.splice(index, 1)
  }

  return unsubscribe
}
```

Now whenever we invoke `subscribe`, we get back our `unsubscribe` function that will
remove the observer from the Subject:

```js
const subject = createSubject()
const oneUnsubscribe = subject.subscribe(oneObserver)
const twoUnsubscribe = subject.subscribe(twoObserver)

subject.next({ message: "Hello" })
oneUnsubscribe()
subject.next({ message: "Goodbye" })
```

<Codesandbox slug="github/johnlindquist/observer-pattern/tree/forEach" module="/src/index.js" console/>

## So If a Subject is an Observer, Can an Observable Subscribe to a Subject?

**YES!** 🤯🤯🤯

```js
const subject = createSubject()
const observable = createObservable(subscribe)

subject.subscribe(oneObserver)
subject.subscribe(twoObserver)

observable.subscribe(subject)
```

<Codesandbox slug="github/johnlindquist/observer-pattern/tree/share" module="/src/index.js" console/>

I'm just going to end this post here and let that demo sink in for a bit 😇