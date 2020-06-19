---
slug: reassign-a-variable-with-destructuring
title: Reassign a Variable With Destructuring
date: 2020-06-18 16:06
published: true
category: ['JavaScript']
---
```js
let source,
    screenings,
    size;

source = {
    screenings: 'a',
    size: 'b'
};

({ screenings, size } = source);
console.log(screenings, size);
```




