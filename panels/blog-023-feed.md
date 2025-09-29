---
title: feed
coordinates: 1 -8
date: 2024-05-05
type: blog
navLinks:
  - 0 0 Home
  - 0 -1 Journal
  - 1 -9 Prev
  - 2 -8 Next
---

I've added an [rss](/rss) feed to the site. Well, not actually. Everyone calls
it an rss feed, but when digging into it, the recommended choice in 2024 for the
fast-moving technical domain of metadata syndication is **Atom**, defined in
[rfc 4287](https://www.ietf.org/rfc/rfc4287.txt).

It's auto-generated using the same scripts I use for generating this
<span class="link" data-x="3" data-y="-2">hilbert curve</span> journal itself,
so it should stay up to date with the latest 20 entries.

And at least at time of writing this entry, it is
[a valid Atom 1.0 feed](https://validator.w3.org/feed/check.cgi?url=https%3A%2F%2Fari.blumenthal.dev%2Frss).
