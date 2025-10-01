---
title: how 2
coordinates: 4 -8
date: 2025-10-01
type: blog
navLinks:
  - 0 0 Home
  - 0 -1 Journal
  - 4 -7 Prev
---

Nothing like writing <a class="link" data-x="3" data-y="-6">how</a> your site is
built (and a little free time) to make you want to completely redo everything.
So, let's dig into what's new.

# Rendering updates

This site is an infinite grid. In the original
<a class="link" data-x="1" data-y="-3">new site, who dis</a> post from nearly 3
years ago, I mention how that works.

The approach to rendering today hasn't changed too much. However, while I
originally left all the panels offscreen in the DOM, it turns out some browsers
don't like that too much (I'm looking at you mobile safari).

So instead, I schedule panels for deletion that are no longer visible, taking
into account the <a class="link" data-x="2" data-y="-8">zoom</a> level (which
may mean that multiple panels are visible at any given time).

# SSR and nojs visitors

In that _new site, who dis_ post, I mentioned:

> I load the whole site on every page load which isn't ideal. If I stick at this
> blogging thing for a while, I will probably write a small server to better
> handle loading panels as needed.

Well, nearly 3 years later, I haven't written all that much (<50 kB of gzip'd
text). Turns out loading the whole site on every page load will still work well
for awhile.

But the ability to load individual panels is still useful for supporting nojs
visitors that otherwise had a broken experience.

So instead of having a codegen step that generates a static version of the site
and picking the appropriate panel client-side, I now use the
[Deno](https://deno.com) JS runtime and package manager (with
[Oak](https://oakserver.org) middleware) to render the appropriate panel
server-side.

# Authoring blog posts

Previously, my blog posts were written in html and I used nginx's _server side
includes_ to add them to the page.

But with my recent switch to using Obsidian during
<a class="link" data-x="5" data-y="-7">week 0</a> for my private notes, I found
that I wanted to use markdown for my public journal, as well.

After building my own format to support a metadata-embedded version of markdown
(with different emojis for different categories (e.g. 📍 for coordinates, 🎨 for
panel type, etc)), I learned about about
[YAML Front Matter](https://jekyllrb.com/docs/front-matter/) and just went with
that instead.

As part of the build step for the site, the YAML is stripped and parsed using
the [jonschlinkert/gray-matter](https://github.com/jonschlinkert/gray-matter)
library. The remaining markdown content is rendered with the
[markedjs/marked](https://github.com/markedjs/marked) library.

# Backlinks

A minor feature I've wanted for awhile (but never got around to) are links back
to the panels that linked to the panel you're on. So yep, added those too.
