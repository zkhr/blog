---
title: new site, who dis
coordinates: 1 -3
date: 2022-12-01
type: blog
navLinks:
  - 0 0 Home
  - 0 -1 Journal
  - 0 -3 Prev
  - 1 -2 Next
---

When I set out on creating this new blog, I knew I wanted it to have a novel
aspect. While the high level content is pretty familiar across personal websites
on the web (about me, blog, projects, etc), the structure puts a fun spin on the
"single page application" concept.

As you may have seen by the time you got to this blog post, **the site is an
infinite grid.** Each page on this site is a panel in that grid.

The prototype for this is relatively straightforward, but it required a couple
interesting pieces across my [nginx](https://www.nginx.com/) config, CSS, and
JS.

# nginx config

For the prototype implementation, I load the entire website, no matter which
page you hit. This allows exploring without having to load anything additional
from the server. Since this site is all text, it loads quickly (and will for the
foreseeable future).

To support this in my nginx configuration, I do two important things:

1. I enable
   [Server Side Includes](http://nginx.org/en/docs/http/ngx_http_ssi_module.html)
   with `ssi on`. This allows me to create a new file per panel and then include
   them individually in the main index.html.

2. I use the
   [rewrite](http://nginx.org/en/docs/http/ngx_http_rewrite_module.html#rewrite)
   directive so that all paths that start with `/!` will get sent to that
   index.html file.

```
location /! {
  rewrite ^.*$ /;
}
```

This allows me to track the current position of the user in the grid in the URL.
For example, this page's path starts with `/!/1/-3`, which defines the x and y
coordinates of 1 and -3 respectively. When the user refreshes the page, we
correctly load the index.html file (instead of throwing a 404 not found error).

# CSS

The grid is a `position: relative` element that holds all of the panels. To move
from panel to panel, we change the grid's left and top properties.

As an analogy, you can think of your monitor as a microscope and the grid as a
slide under the lens. To move around, we move around the slide, while the scope
remains stationary.

Within the grid are several `position: absolute` panels. Each panel has distinct
x and y coordinates, which are used to set appropriate left and top properties
when initializing the page. Because of the relative position attribute on the
grid, these are absolute positions relative to the grid.

# JS

For the prototype, the JS code does three main things:

1. Placement of the grid panels at their appropriate locations in the grid.

2. Enabling the grid links so that we can easily navigate between panels.

3. Supporting keyboard navigation (asdf, hjkl, arrow keys) as well as
   touchscreen navigation as alternative mechanisms to move between panels.

And that's pretty much it. As mentioned, I load the whole site on every page
load which isn't ideal. If I stick at this blogging thing for a while, I will
probably write a small server to better handle loading panels as needed.
