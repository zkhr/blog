---
title: denounce
coordinates: 6 -7
date: 2026-10-17
type: blog
navLinks:
  - 0 0 Home
  - 0 -1 Journal
  - 7 -7 Prev
---

Just saw a few days ago that
[Deno joined Cloudflare](https://deno.com/blog/cloudflare) with plans to stop
supporting it in ~1 year. And
[Bun joined Anthropic](https://bun.com/blog/bun-joins-anthropic) last December.

So I've moved the blog back to node.

I'd made the jump to deno last year during the <a class="link" data-x="4"
data-y="-8">how 2</a> rewrite. Oh well.

## Also CSS

I realized I don't really need SCSS anymore given CSS's capabilities and the
loading setup I have on this blog, so I dropped to just plain CSS.

## A caveat for a caveat

As mentioned in <a class="link" data-x="3" data-y="-6">how</a>,
<a class="link" data-x="6" data-y="-9">claude</a>, and
<a class="link" data-x="7"
data-y="-9">lee sedol</a>, this blog does not and will not use AI or LLMs to
generate any of its content.

But what does that mean about its dependencies...

In migrating Deno to Node, I needed to replace the `DOMParser` from `deno-dom`
with something. I tried the lightweight
[dom-parser](https://github.com/ershov-konst/dom-parser), but it was missing a
bunch of properties on Element that I wanted.
[xmldom](https://github.com/xmldom/xmldom) too. The popular
[jsdom](https://github.com/jsdom/jsdom) has a bunch of codex commits earlier
today and [htmlparser2](https://github.com/fb55/htmlparser2) has claude commits
earlier this week.

I haven't even checked any of my other dependencies yet. But between `esbuild`
(replacing deno/emit), `express` (replacing @oak/oak), `gray-matter`, and
`marked` direct dependencies, node_modules has a long list of additional deps.
It's guaranteed at least one thing in there is contaminated.

And even node has a good
[AI use policy](https://github.com/nodejs/node/blob/main/doc/contributing/ai-guidelines.md)
but that doesn't say no AI was used, just that humans are needed in the loop.

This feels like some sort of GPL sort of thing where all it takes is one library
to use AI for the entire chain to lose any sort of "no AI was used" claim.

I'll have to think on this. I begrudgingly went with jsdom for now.

## A caveat for a caveat for a caveat

This is not to say AI coding is necessarily a bad thing. I use it heavily at
work and in that context it seemingly helps. But for a personal project, that is
not what I want, and am grappling with what that means.
