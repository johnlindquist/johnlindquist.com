---
slug: rxjs-operators-made-easy
title: RxJS Operators Made Easy
date: 2019-09-24 16:09
published: false
---



## Operator Patterns

Always remember that _ALL_ Operators return an Observable and the
parameters you pass in configure that Observable.

## Creation Operators



## Transformation Operators

The following is a template for transformation operators. It's very similar to a Creation Operator,
but expects a `source` as the 2nd, curried argument so it can be used in `pipe`. Transformation Operators
concern themselves with modifying the value passed through to `observer.next`, so you end up
wrapping `observer.next` with a new `next` function:

```js
const transformOperator = config => source => {
  const newSource = new Observable(observer => {
    const next = value => {
      //redefine the `next` behavior      
    }
    source.subscribe({
      next
    })
  })

  return newSource
}
```

### mapTo - push a different value from the original

Example usage: Logs "hello" every click

```js
click
  .pipe(mapTo("hello"))
  .subscribe(console.log)
```

Notice that we're passing the value directly to `observer.next` and
ignoring the `originalValue`:

```js
const mapTo = value => source => {
  const newSource = new Observable(observer => {
    const next = originalValue => {//ignore the original value
      observer.next(value)
    }
    source.subscribe({
      next
    })
  })

  return newSource
}
```

### map - modify the original value with a transform function

Example usage: 

```js
click
  .pipe(map(event => event.x * 2))
  .subscribe(console.log)
```

In the example above, `event => event.x * 2` is our `fn`. So we'll pass the
original value, the event, into our `fn` and pass that on to our `observer.next`:

```js
const map = fn => source => {
  const newSource = new Observable(observer => {
    const next = value => {
      const transformedValue = fn(value)
      observer.next(transformedValue)
    }
    source.subscribe({
      next
    })
  })

  return newSource
}
```

### pluck - get a property off of the value

Example usage: 

```js
click
  .pipe(pluck("x"))
  .subscribe(console.log)
```

Pass a `key` to `pluck`, then we can grab that property off the original value:

```js
const pluck = prop => source => {
  const newSource = new Observable(observer => {
    const next = value => {
      observer.next(value[prop])
    }
    source.subscribe({
      next
    })
  })

  return newSource
}
```

### bufferCount - Wait until a defined amount of values come in, then call `next`

Push values into an Array. If the Array length matches the `count`, then call `observer.next`
with the Array.

```js
const bufferCount = count => source => {
  const newSource = new Observable(observer => {
    let buffer = []

    const next = value => {
      buffer.push(value)
      if(buffer.length === count){
        observer.next(buffer)
        buffer = []
      }
    }
    source.subscribe({
      next
    })
  })

  return newSource
}
```

#### Endnote: A `subscriber` is an `observer`

When you invoke `subscribe` with your `observer`,  [RxJS passes your `observer` to a `toSubscriber` helper](https://github.com/ReactiveX/rxjs/blob/master/src/internal/Observable.ts#L211)
and wraps the `observer` with a `subscriber`.

```js
//When you do this
.subscribe(observer)
//RxJS does this under the hood
sink = new Subscriber(observer)
```

I'll talk more about Subscribers in future posts, but for the purposes of this post,
I'll used name `observer` everywhere (remember, a `subscriber` is an `observer`). For teaching purposes, 
I think it's easier to grok that an `Observable` pushes to `observers`. You might disagree with my choice 🤷‍♂️ 
