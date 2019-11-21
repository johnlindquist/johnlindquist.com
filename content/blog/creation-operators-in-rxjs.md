---
slug: creation-operators-in-rxjs
title: Rolling Your Own Creation Operators in RxJS
date: 2019-09-27 11:09
published: true
---

## The Value of Writing Your Own Operators

When you `import {Observable} from "rxjs"`, you open up a world of possibility. Granted, RxJS
ships _a lot_ of operators that handle _a lot_ of edge cases, but we've seen many people
abandon lodash/underscore to write their own array utils. So why not RxJS? You could
even argue you want to save on file size, why bring in the `fromEvent` code that supports
node events if you're only settings up a DOM click event? Hopefully I can help take the edge
off of rolling your own.

As with all Operators, you begin with:

```js
import { Observable } from 'rxjs'
```

> 📝 Someday, TC-39 _might_ add an Observable primitive and we wouldn't even have to install RxJS

## The Creation Operator Template

The following is a template you can use whenever you want to make a creation operator:

```js
const creationOperatorTemplate = config => {
  const source = new Observable(observer => {
    return () => {
      //unsubscribe logic
    }
  })

  return source
}
```

The main thing to notice is you're creating and returning an Observable.

### of - push a single value

`of` passes in a `value`:

```js
const of = value =>
```

then sends that value through `observer.next` and completes immediately:

```js
observer.next(value) //push out one value
observer.complete() //and done
```

Full operator:

```js
const of = value => {
  const source = new Observable(observer => {
    observer.next(value) //push out one value
    observer.complete() //and done
  })

  return source
}
```

### fromEvent - push events

`fromEvent` takes the target and eventType (e.g., `document` and `"click"`)

```js
const fromEvent = (target, eventType) =>
```

Then uses `observer.next` as the event handler:

```js
const next = observer.next.bind(observer)
target.addEventListener(eventType, next)
```

Lastly, unsubscribe will remove the eventHandler:

```js
target.removeEventListener(eventType, next)
```

The full `fromEvent` operator:

```js
const fromEvent = (target, eventType) => {
  const source = new Observable(observer => {
    const next = observer.next.bind(observer)
    target.addEventListener(eventType, next)

    return () => {
      target.removeEventListener(eventType, next)
    }
  })

  return source
}
```

### interval - push an incremented number every X seconds

`interval` passes in the `delay`

```js
const interval = delay =>
```

Uses the `delay` in a `setInterval`:

```js
setInterval(callback, delay)
```

Our `setInterval` will call the `callback`, so we'll use `next` inside the `callback`
and increment an `i` just so we have a value to pass to `next` (you can pass whatever you
want to `next`, an incrementing number makes sense for an interval):

```js
let i = 0
const callback ()=> {
  next(i++)
}
```

Now to `unsubscribe`, we need the `id` so we can run `clearInterval`:

```js
const id = setInterval(callback, delay)

return () => {
  clearInterval(id)
}
```

The full `interval` operator:

```js
const interval = delay => {
  const source = new Observable(observer => {
    const next = observer.next.bind(observer)

    let i = 0
    const callback ()=> {
      next(i++)
    }

    const id = setInterval(callback, delay)

    return () => {
      clearInterval(id)
    }
  })

  return source
}
```

### merge - push values from all observables

`merge` takes in an Array of observables:

```js
const merge = (...observables) =>
```

Runs `subscribe` on all of them:

```js
observables.forEach(observable => {
  observable.subscribe(newObserver)
})
```

_But_, to `unsubscribe` from all the observables, we'll need all of their
subscriptions, so we'll need to use `map`:

```js
const subscriptions = observables.map(observable => {
  const subscription = observable.subscribe(newObserver)

  return subscription
})
```

Then we can `unsubscribe` from all of them by looping through the `subscriptions`:

```js
return () => {
  subscriptions.forEach(subscription => {
    subscription.unsubscribe()
  })
}
```

The edge-case for `merge` is that we want to wait until _all_ the observables
call `complete` before calling `complete` on the main `observer`. So we can
count the observables:

```js
let active = observables.length
```

Then decrement the count each time one of them completes. If the count is `0`, then
call the main `complete`:

```js
complete: () => {
  active--
  if (active === 0) {
    complete()
  }
}
```

```js
const merge = (...observables) => {
  const source = new Observable(observer => {
    const next = observer.next.bind(observer)
    const complete = observer.complete.bind(observer)
    const error = observer.error.bind(observer)

    let active = observables.length

    const subscriptions = observables.map(observable => {
      const newObserver = {
        next,
        error,
        complete: () => {
          active--
          if (active === 0) {
            complete()
          }
        },
      }

      const subscription = observable.subscribe(newObserver)

      return subscription
    })

    return () => {
      subscriptions.forEach(subscription => {
        subscription.unsubscribe()
      })
    }
  })

  return source
}
```

### combineLatest - Grab the latest value from each Observable, push them all through as an Array

We'll pass in an Array of Observables:

```js
const combineLatest = (...observables) =>
```

Subscribe to all of them and get their `subscriptions` (just like we did with `merge`):

```js
const subscriptions = observables.map((observable, i) => {
  const subscription = observable.subscribe(value => {})

  return subscription
})
```

Then we can create an Array of values that matches the length of the Array of Observables:

```js
const values = Array.from({ length: observables.length })
```

To wait for each Observable to emit a value, we'll fill our Array of values
with placeholder symbols:

```js
const waiting = Symbol('waiting')
const values = Array.from({ length: observables.length }).fill(waiting)
```

Then inside `next`, we'll only push to `observer.next` if all of the values no longer contain
that placeholder:

```js
values[i] = value
if (values.every(value => value !== waiting)) {
  observer.next(values)
}
```

Below is the full implementation:

```js
const combineLatest = (...observables) => {
  return new Observable(observer => {
    let values = Array.from({ length: observables.length })

    const subscriptions = observables.map((observable, i) => {
      const subscription = observable.subscribe(value => {
        values[i] = value
        if (values.every(value => value)) {
          observer.next(values)
        }
      })

      return subscription
    })

    return () => {
      subscriptions.forEach(subscription => {
        subscription.unsubscribe()
      })
    }
  })
}
```
