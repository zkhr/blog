---
title: zoom
coordinates: 2 -8
date: 2024-06-02
type: blog
navLinks:
  - 0 0 Home
  - 0 -1 Journal
  - 1 -8 Prev
  - 2 -9 Next
---

If you're on desktop, you can now zoom in and out on the grid with the `[` and
`]` keys.

I'd previously toyed with animations that would zoom in and out when navigating
far distances on the grid, but never settled on one that I liked. This feature
takes inspiration from that, letting you just zoom in and out as you please.

At 3 levels of zoom, the performance of the page is a little janky, but not so
bad that I want to do further rendering improvements (above and beyond the
switch from position offsets to css transforms in this commit).
