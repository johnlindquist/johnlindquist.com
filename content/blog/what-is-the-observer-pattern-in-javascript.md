---
slug: what-is-the-observer-pattern-in-javascript
title: What Is the Observer Pattern in JavaScript?
date: 2019-09-17 13:09
published: true
---

The _Observer Pattern_ has `state` and objects that are notified when state changes so they can query the state.

## Check the State from the Observer
First, the `state` is held inside of an object that we'll call a `subject`:

```js
const subject = {
  state: {
    message: "Hello"
  }
}
```

To create an `observer`, we need to capture the `subject` inside the `observer`
so we can query the state later:

```js
const createObserver = subject => {
  const observer = {
    subject
  }
  return observer
}
```

When we bring this all together, we can create an `observer` which can check the `state`
of the `subject`:

<Codesandbox slug="github/johnlindquist/observer-pattern" module="/src/index.js" console/>



## An Array of Observers
The `subject` now needs a way to notify the observers that things have changed. Let's add an array
of `observers` to our `subject`:

```js
const subject = {
  state: {
    message: "Hello"
  },
  observers:[]
}
```

We can now add our observer to that array when the observer is created:

```js
const createObserver = subject => {
  const observer = {
    subject
  }

  subject.observers.push(observer)
  return observer
}
```

Now we're able to check on all of the observer from the `subject` as demonstrated below:

<Codesandbox slug="github/johnlindquist/observer-pattern/tree/observers" module="/src/index.js" console/>

## Notify the Observers

Finally, we can notify all the observers when the state changes. Let's create an `update`
method on our `subject` to `update` the state:

```js
const subject = {
  state: {
    message: "Hello"
  },
  observers:[],
  update(value){
    this.state = value
  }
}
```

Now create a `notify` method on our observer so it can "pull" the state an check on it:
```js
const createObserver = subject => {
  const observer = {
    subject,
    notify(){
      console.log('State updated to', this.subject.state)
    }
  }

  subject.observers.push(observer)
  return observer
}
```

Lastly, bring it all together by invoking `notify` on all the observers in the `update` method:

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

All that's left to do is invoke `update` with a new state and all the observers will be
notified and pull the state in:

<Codesandbox slug="github/johnlindquist/observer-pattern/tree/notify" module="/src/index.js" console/>

## TL;DR

* Observers pull the state from the Subject
* The Subject tracks all the Observers
* Updating state on the Subject invokes a method on all of the Observers

### Questions:
**Q: Couldn't I "push" the `state` by passing it into the Observers's `notify` method?**

A: Sure.

**Q: Isn't this a lot of hoops to jump through for an array of objects with a method on them?**

A. Kinda? But you have to imagine larger applications that require strict structure
and rules for your whole team to follow. 