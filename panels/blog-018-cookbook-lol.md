---
title: cookbook.lol
coordinates: 1 -7
date: 2024-02-12
type: blog
navLinks:
  - 0 0 Home
  - 0 -1 Journal
  - 1 -6 Prev
  - 0 -7 Next
---

I put together a minimal website over at [cookbook.lol] to start storing my
recipes. This is the start of the cookbookbook idea from
<span class="link" data-x="0" data-y="-6">project ideas i.</span>

It does a couple cool things:

- You can track when recipes are variations of other recipes (either on the site
  or from a blog or cookbook)
- It has some basic organization (tracking saved/tried recipes)
- It has support for basic comment threads.

It is definitely missing a lot of features and there’s tons more I want to do
here, but the core functionality is there.

If you're reading this and you want an invite, just shoot me an email.

# Design Overview

There is an existing nginx instance running for this blog which routes traffic
to new local frontend and backend servers. In the future, we can split one or
both of these out into their own instances.

The frontend serves all requests to [cookbook.lol]. These requests are served by
a nodejs server that renders a bunch of closure (aka soy) templates.

The backend server is a minimal (mostly aip.dev style resource-oriented) API
implemented in nodejs with postgresql for storage.

[cookbook.lol]: https://cookbook.lol
