---
slug: understanding-rxjs
title: Understanding RxJS
date: 2019-03-19 17:03
published: true
---

RxJS has these 4 parts:

1. callback
2. creating new callbacks from original
3. callback caller
4. startup

I like to think of it like this:

```js
//observer
const callback = value => {
  console.log(value)
}

//observable
const callbackCaller = callback => {
  document.addEventListener('click', callback)
}

//map
const transform = x => x + 1

//internals
const createNewCallbackFromTransform = (transform, callback) => {
  const newCallback = value => callback(transform(value))

  return newCallback
}
//subscribe
callbackCaller(createNewCallbackFromTransform(transform, callback))
```
