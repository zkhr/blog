---
title: hilbert curve
coordinates: 3 -2
date: 2022-12-11
type: blog
navLinks:
  - 0 0 Home
  - 0 -1 Journal
  - 2 -2 Prev
  - 3 -3 Next
---

As mentioned in the
<a class="link" data-x="1" data-y="-3">new site, who dis.</a> blog post, this
site is an infinite grid, with each page on the site being a panel on that grid.
This raises the question, how do I decide where on the grid to place new pages?

Being an infinite grid, there are an infinite number of options! For example, we
could just go off in an arbitrary direction:

```
··············
··█───────────
··············
```

But that doesn't really take advantage of the dimensionality of the grid.
Instead, we could spiral around a point:

```
┌─────┐
│┌───┐│
││┌─┐││
│││█│││
│││└┘││
││└──┘│
│└────┘
```

Or we could use the
[Cantor Pairing Function](https://en.wikipedia.org/wiki/Pairing_function) or
even pick randomly!

So, what did I go with? Well, for blog posts, I decided to use the
[Hilbert curve](https://en.wikipedia.org/wiki/Hilbert_curve), a space filling
fractal, since it
[has some nice properties](https://datagenetics.com/blog/march22013/).

```
█·······
│┌─x┌─┐┌
└┘┌┘└┐└┘
┌┐└┐┌┘┌┐
│└─┘└─┘│
└┐┌──┐┌┘
┌┘└┐┌┘└┐
│┌┐││┌┐│
└┘└┘└┘└┘
```

This blog post is at 'x' on the curve.

If you get lost navigating the grid, you can always grab a
<span data-loot="map" class="loot">map</span> to check your position.
