---
slug: replacing-named-parameters-with-function-composition
title: Replacing Named Parameters With Function Composition
date: 2019-04-08 14:04
published: true
readingTime: 10 minutes
twitterEmbedVideo: javascript-refactor-named-parameters-to-function-composition
---

A quick little [https://egghead.io](egghead) lesson if you're in to that sorta thing:

<EggheadEmbed slug="javascript-refactor-named-parameters-to-function-composition" />

Named parameters are a great feature of JavaScript, don't get me wrong, but sometimes
functional composition is a more elegant solutions (I SAID _SOMETIMES_!).

The example I'll be refactoring looks like this:

```js
const select = ({ to, from, array }) => array.slice(from, to)
```

Seems like perfectly normal code, right? Let's investigate...

## What's Your Output?

Is it a String? An Array? An Object? This matters because composition requires that
your _output_ can also be the _input_ of the next function. So you need to transform
the data one step at a time. In our example that means we'll need to output an array
so the next input can be an array.

For example, chopping off the end of the array:

```js
const to = x => array => array.slice(0, x)
```

Then chopping off the beginning:

```js
const from = x => array => array.slice(x)
```

These two functions fit together because they both have an `array` as _input_ and _output_.

So that begs the question...

## What Is Your _Input_?

Is your _input_ really an object with a bunch of options?

```js
select({ from: 3, to: 5, array: nums })
```

The true _input_ there is the `nums`, the other options _modify_ the `nums`.

> `array` is the _input_. `to` and `from` _modify_ the input.

Compare these two below:

<Codesandbox
  slug="github/johnlindquist/fp-lessons/tree/refactor-named-parameters"
  console
/>

I saw another example online using a simple `formatDate` function like this:

```js
const formatDate = ({ day, month, year }) => `${month}/${day}/${year}`
```

The true input of that function is probably an implied empty string `""`. Then
you can modify the string one step at a time to get the final result.

The complexity in the example below shoots through the roof compared to the snippet
above, but the flexibility of "working with a string" gives you many, many more options.
In fact, this is probably the beginning of an entire date formatting library.

<Codesandbox slug="lr122o08rz" console />

So compare the implementations:

```js
const formatDate = ({ day, month, year }) => `${month}/${day}/${year}`
formatDate({ day: 30, month: 6, year: 2019 })
```

vs. using functions:

```js
const formatDate = compose(
  day(30),
  year(2019),
  month(2),
)

formatDate('')
```

In this contrived example, notice how each named parameter is now represented by
a function which modifies the input. Between the two examples, which do you think conveys the intention better?
Which is more flexible for refactoring and adding features?

Ok, so that example is a little wacky, I know. Sometimes I go overboard. But hopefully
I've got you thinking about what your inputs and outputs truly are and why functions
are sometimes preferred over stacking on additional named parameters.
