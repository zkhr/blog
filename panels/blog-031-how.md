---
title: how
coordinates: 3 -6
date: 2025-01-27
type: blog
navLinks:
  - 0 0 Home
  - 0 -1 Journal
  - 2 -7 Prev
  - 4 -6 Next
---

<div class="section">
  <div class="quote ac-quote">
    <div>
      Technological advance is an inherently iterative process. One does not
      simply take sand from the beach and produce a Dataprobe. We use crude
      tools to fashion better tools, and then our better tools to fashion
      more precise tools, and so on. Each minor refinement is a step in the
      process, and all of the steps must be taken.
    </div>
    <div class="attribution">
      -- Chairman Sheng-ji Yang,
      <div>"Looking God in the Eye"</div>
    </div>
  </div>
</div>

# colophon

I've written previously in
<a class="link" data-x="1" data-y="-3">new site, who dis</a> on the structure of
this site, but not much on how I build it.

Everything on this site is hand-written in vim by sshing into (and attaching to
a tmux session on) a linode (named **santiago**) from my laptop (more recently
an M3 Pro named **acen**, but previously a 10+ year old asus zenbook with
long-standing keyboard and not-wanting-to-boot issues). That server hosts this
site and some of my other assorted
<a class="link" data-x="1" data-y="0">projects</a>.

I check my work on a staging instance of the blog, `git push` from the staging
repo when I'm done, and then `git pull` from the prod repo to update the live
site.

# authorship

This blog does not and will not use AI or LLMs to generate any of its content.
The code is entirely written by me or scripts that I've written and checked into
its [zkhr/blog](https://github.com/zkhr/blog) github repo. (I briefly toyed
around with the idea in 2023 of sharing dialogues with bots on my site, but I've
since
[removed them](https://github.com/zkhr/blog/commit/eac27da5a347130beca3ed52cee958cbbda97f4f).)

# permanence

Jeph Jacques made a comment on
[QC #5458](https://questionablecontent.net/view.php?comic=5458) that he could
just go back and fix old comics, but it took him ~20 years to realize that.

I had this similar idea in my head that the content of these journal entries
needed to be static snapshots and any changes needed dated caveats (like in
<a class="link" data-x="1" data-y="-6">birds</a>), but at the end of the day,
this is my blog so I can fix mistakes (like "sweet spot" to "soft spot" in
<a class="link" data-x="2" data-y="-2">pokémon scarlet</a>).

And this is all checked into a git repo, so the history is still there if I
want.
