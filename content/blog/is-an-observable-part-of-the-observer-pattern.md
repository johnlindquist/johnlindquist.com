---
slug: is-an-observable-part-of-the-observer-pattern
title: Is an Observable Part of the Observer Pattern?
date: 2019-09-18 10:09
published: true
---

## TL;DR

**No.**

## Goodbye State 👋

In our [previous post](/what-is-the-observer-pattern-in-javascript) we
defined `observers` as objects that take a `subject` and can pull the
state in.

```js
const createObserver = subject => {
  const observer = {
    subject,
    notify() {
      console.log("State updated to", this.subject.state)
    }
  }

  subject.observers.push(observer)
  return observer
}

const observer1 = createObserver(subject)
```

With `Observables`, the concept of "state" is gone. We're now thinking
in events (AKA "pushing values over time").

Because `state` is gone, we can rip most everything out of our `observer`
and leave it with a single callback. Compare this snippet below to the much
longer snipped above and you'll see the `subject` is completely gone.

```js
const observer = {
  notify(value){ //notify is named `next` in RxJS
    console.log(`new value received`, value)
  }
}
```

With such a simple `observer`, this leaves all the remaining work
to be done from the source object (AKA the `Observable`).

So let's create a factory for our `Observable` that takes in an `observer`:


```js
const createObservable = observer => {
  observer.notify({ message: "hello" })
}
```

<Codesandbox slug="github/johnlindquist/observer-pattern/tree/observable" module="/src/index.js" console/>


Now, we could push as many values into `observer.notify` as we needed. In fact,
you could set up an event listener inside the `createObservable` and
you're mostly following the spirit of `Observables`

```js
//The spirit is there, but it's still missing important pieces
const createObservable = observer => {
  document.addEventListener("click", observer.notify)
}
```

## Start and Stop (Subscribe and Unsubscribe)

`Observables` need an API to start and stop their values. Start a timer,
stop a timer. Start listening, stop listening. Etc. But with our
current setup, the opportunity to start and stop is locked away inside
of the `createObservable` function. 

Let's add that functionality with the most straight-forward way possible
by creating a `subscribe` function and an `unsubscribe` and then returning
them:

```js
const createObservable = observer => {
  const subscribe = () => {
    document.addEventListener("click", observer.notify)
  }

  const unsubscribe = () => {
    document.removeEventListener("click", observer.notify)
  }

  return {
    subscribe,
    unsubscribe
  }
}

observable.subscribe()
observable.unsubscribe()
```

## Unsubscribe _After_ You Subscribe

Unfortunately, our current setup introduces a bug where you could
`unsubscribe` before you had called `subscribe`. You fix this by having
the `subscribe` function return an `unsubscribe` function. That way
you don't have access to `unsubscribe` until you've `subscribed` in
the first place:

```js
const createObservable = observer => {
  const subscribe = () => {
    document.addEventListener("click", observer.notify)

    //unsubscribe now lives inside of `subscribe`
    const unsubscribe = () => {
      document.removeEventListener("click", observer.notify)
    }

    return unsubscribe
  }

  return {
    subscribe
  }
}

const observable = createObservable(observer)

const unsubscribe = observable.subscribe()
unsubscribe()
```

## Extracting `subscribe` for Flexibilty

You may have noticed that `subscribe` is a standalone, reusable function
trapped inside of `createObservable`. Let's see what if would look
like with a cut n' paste extraction refactoring:

```js
//BROKEN: missing `subscribe`
const createObservable = observer => {
  return {
    subscribe
  }
}

//BROKEN: missing `observer`
const subscribe = () => {
  document.addEventListener("click", observer.notify)

  const unsubscribe = () => {
    document.removeEventListener("click", observer.notify)
  }

  return unsubscribe
}
```

That _almost_ worked, but we need to do 2 things:

1. Move the `observer` into `subscribe`
```js
const subscribe = () =>
//becomes
const subscribe = observer =>
```

2. Move the `subscribe` into `createObservable`
```js
const createObservable = observer =>
//becomes
const createObservable = subscribe =>
```

## We Did It! 🎉

Believe it or not, we've finally landed on an Observable:

```js
const createObservable = subscribe => {
  return {
    subscribe
  }
}

const subscribe = observer => {
  document.addEventListener("click", observer.notify)

  const unsubscribe = () => {
    document.removeEventListener("click", observer.notify)
  }

  return unsubscribe
}
```

You can see it in action below. A challenge for you is to create your
own `subscribe` functions that you can pass in to `createObservable`.
Try using `setInterval` or any other async tool that can start and stop.

<Codesandbox slug="github/johnlindquist/observer-pattern/tree/done" module="/src/index.js" console/>
