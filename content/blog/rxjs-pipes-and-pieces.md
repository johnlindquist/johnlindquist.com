---
slug: rxjs-pipes
title: Why are RxJS Operators and Pipe So Confusing?
date: 2019-09-20 17:09
published: true
---

## What Does Pipe Do Anyway?

Let's take a quick look at the most common RxJS example. This code will log out
`MouseEvents` from clicking on the documuent:

```js
import { fromEvent } from "rxjs"

fromEvent(document, "click").subscribe(value => {
  console.log(value)
})
```

So what happens when we add a `pipe` into the mix:

```js
fromEvent(document, "click")
.pipe() //what happens here?
.subscribe(value => {
  console.log(value)
})
```

<Codesandbox slug="github/johnlindquist/observer-pattern/tree/rxjs-pipe" module="/src/index.js" console/>


As it turns out, our `MouseEvent`s are still logged out. This is the _exact_ same behavior
as before. But why?


## `Pipe` Returns an Observable

To demonstrate, the code belows shows that `pipe` returns its own observable:

```js
const observable = fromEvent()

console.log(observable === observable.pipe()) //true
```

## So What's an `Operator`?

An `operator` is a function you pass into a `pipe`. And `pipe` returns its own observable. So let's think about what that means:

1. An `operator` has the original observable as the first argument
2. An `operator` returns an observable

This most basic `operator` we can write looks like this:

```js
const operator = observable => {
  //return the original observable
  return observable
}

fromEvent(document, "click")
.pipe(operator) //our operator only passes the observable through
.subscribe(value => {
  console.log(value)
})
```

## Observable In, Observable Out

Since returning the original observable does nothing, let's try returning a different observable. Pay special attention to the following:

1. The `click` observable never calls subscribe! It's simply ignored by the operator
2. We `subscribe` to the `hi` observable

In fact:

```js
console.log(click.pipe(() => hi) === hi) //true!
```

This isn't at all what we want, but it proves "Observable in, Observable out"

<Codesandbox slug="github/johnlindquist/observer-pattern/tree/rxjs-operator-hi" module="/src/index.js" console/>

## Always `subscribe` to the Original Observable Inside of an Operator

The previous examples were simply to prove a point: Operators receive the original Observable return an Observable.
But the purpose of operators is to `subscribe` to the original Observable then change the behavior of the observer:


The simplest example I can think of involves `subscribing` and logging out "hi". 
```js
const operator = observable => {
  observable.subscribe(value => {
    console.log("hi")
  })

  return observable
}
```

With this operator in place, our demo will log out both `"hi"` and the `MouseEvent`.

<Codesandbox slug="github/johnlindquist/observer-pattern/tree/hi-and-mouse-event" module="/src/index.js" console/>


## The `Operator`'s True Purpose: Intercepting Values from Observables

Herein lies the secret sauce of operators:

1. Create a new Observable inside the Operator
2. `subscribe` to the original Observable
3. Pass different values to `next`

```js
const operator = observable => {
  const newObservable = { //1. Create a new Observable
    subscribe: next => {
      observable.subscribe(value => { //2. Subscribe to the original
        next("hi") //3. Pass a different value to `next`
      })
    }
  }

  return newObservable
}
```
<Codesandbox slug="github/johnlindquist/observer-pattern/tree/operator-new-observable" module="/src/index.js" console/>


This opens the door to do _anything_ inside an operator!

> ❗️ RxJS has APIs for creating new Observables (e.g., `new Observable`). It's important to use
the API instead of the plain object we wrote above to handle completion, errors, and many more cases.

## Adding Arguments to Operators

Let's extract the `"hi"` from our previous example to be an argument in our operator:

```js
//before
const operator = observable => {
...
next("hi")

//after
const operator = message => observable => {
...
next(message)
```

Now we can pass `"hi"` as the first argument to our operator.

```js
observable.pipe(operator("hi"))
```

`operator(message)` creates a function
that's passed back to `pipe` which then passes in the Observable. If this is unfamiliar, it may help to
see it written out in long-form, then refactored step-by-step:

### Long Version
```js
observable.pipe(observable => {
  const newOperator = operator("hi")

  return newOperator(observable)
})
```

### Medium Version

```js
observable.pipe(observable => {
  return operator("hi")(observable)
})
```

### Short Version
```js
observable.pipe(operator("hi"))
```

All three versions are the same. It only depends on your exposure to these coding patterns
for which version is the most comfortable to you. I'd recommend becoming familiar with the
short version, because that's what all the RxJS docs use.



You now have unlimited customization options. You can pass in values, functions, observables, or 
anything you want to customize how your new Observable will behave. The power is in your hands! 💪



## Pipe Internals from Scratch

Let's strip down our RxJS patterns to the _bare minimum_ required to "push"
values to a `next` function. Here's our `next` function:


```js
const next = value => {
  console.log(value)
}
```

Next, we'll create a barebones Observable; an Object with a `subscribe` method
which takes `next` as a function and invokes it:

```js
const observable = {
  subscribe: next => {
    next("hello")
  }
}
```

Finally, invoke `subscribe` with `next` and you should see "hello" in the console:

<Codesandbox slug="github/johnlindquist/observer-pattern/tree/subscribe-next" module="/src/index.js" console/>

## Here Comes the `Pipe` 

\[Insert "ceci n'est pas une pipe" joke here]

The `pipe` method will sit in-between the `Observable` and the `Observer` allowing
us to operate on what happens between the beginning and the end:

```js
observable.pipe(/*do something awesome*/).subscribe(next)
```

To create a `pipe` method, we need to pass the `Observable` itself (AKA `this` in JavaScript)
down through the `pipe` so it has access to the internals:

```js
pipe(operator){
  operator(this)
}
```

We can drop that `pipe` method directly on to the `Observable`:

```js
const observable = {
  subscribe: next => {
    next("hello")
  },
  pipe(operator){
    return operator(this)
  }
}
```

Let's create an `operator` that does _nothing_:

```js
const operator = observable => {
  return observable
}
```

And now drop the `operator` into the `pipe`:

```js
observable.pipe(operator).subscribe(next)
```

You'll see that we get the same `"hello"` output as before. The `Observable`
is going in the function and out the function unchanged:

<Codesandbox slug="github/johnlindquist/observer-pattern/tree/operator" module="/src/index.js" console/>

## `pipe` Can Take Multiple Operators

If you've seen many `pipe` demos, you've probably seen:

```js
.pipe(map, filter, scan)
```

Multiple arguments is simply an API choice for convenience by the RxJS team. If they would have
limited `pipe` to one argument, you would have to chain `pipe` like this:

```js
.pipe(map)
.pipe(filter)
.pipe(scan)
```

To enable multiple operators in our demo, we have to treat them as an Array. We can use
the `...` array syntax to pull in every operator as an Array. Then use `reduce` on that
Array to apply each operator to the observable:

```js
pipe(...operators) {
  return operators.reduce((observable, operator) => {
    return operator(observable)
  }, this)
}
```

Now we're free to pass in as many operators as we want:


<Codesandbox slug="github/johnlindquist/observer-pattern/tree/pipe-reduce" module="/src/index.js" console/>
