---
title: lee sedol
coordinates: 7 -9
date: 2026-04-12
type: blog
navLinks:
  - 0 0 Home
  - 0 -1 Journal
  - 6 -9 Prev
---

<div class="section">
  <div class="quote ac-quote">
    <div>
      Once a man has changed the relationship between himself and his
      environment, he cannot return to the blissful ignorance he left.  Motion,
      of necessity, involves a change in perspective.
    </div>
    <div class="attribution">
      -- Commissioner Pravin Lal
      <div>"A Social History of Planet"</div>
    </div>
  </div>
</div>

Okay, after taking <a class="link" data-x="6" data-y="-9">claude</a> for a spin
a few months ago, I've been using it pretty heavily at my new job.

I'd estimated that the SWE role would change to just doing code reviews for a
living, and that isn't far off. And it is so incredibly far off.

I have a lot of thoughts on this topic. Most people have articulated them better
than me. But, as is true of most stuff on this site, it's nice for me to be able
to have a reference to look back at down the road.

# My setup

I'm currently on the $100/mo Claude Code 5x Max plan. I consistently hit the 5
hour cap twice each day during working hours, so I'm considering bumping that to
the 20x plan. Or hoping that Anthropic
[fixes whatever is going on](https://old.reddit.com/r/Anthropic/comments/1s7zfap/investigating_usage_limits_hitting_faster_than/).

My current setup is a my 2024 M3 MacBook Pro hooked up to two Dell S2719DGF 27"
monitors I got in 2019. My right monitor is dedicated to a full-screen terminal
with a tmux session containing 6 panes in a 2x3 grid.

Each pane is (typically) dedicated to an ongoing claude session, although
depending how involved a particular task is, I may have just 1-2 running or
all 6.

I try and make sure that of the 6 panes, at least one is working on new
features, one is fixing bugs or improving old features, one is cleaning up
technical debt, and one is doing exploration and planning. The other two are
wildcards for whatever needs to get done.

To handle parallel claude instances working in the same codebase, I tried git
worktrees, but didn't like that I couldn't have the same branch checked out in
multiple places. So I ended up with my own bespoke setup.

I have a `~/foo` directory for everything related to my current job (not
actually foo, but you get the idea). Within that directory, I create new
"workspaces" as needed following the
[NATO phonetic alphabet](https://ari.blumenthal.dev/ariados/codes), e.g.
`~/foo/alfa/`, `~/foo/bravo/`, etc. In each of those, I'll clone one or more of
the git repos that we use on our team.

This setup seems to work pretty well, but we'll see how it evolves over time.

# Wrangling

In my experience so far, no matter the difficulty, vibe coding today
successfully creates amazing prototypes and functional yet garbage code. There
are 2 things that I've found are an absolute necessity to mitigate this. Always
plan and always review.

If you're asking, "Hey Ari, aren't Googlers known to write way too many design
docs and have onerous processes around code review?"

I'd say, first of all, I'm a Xoogler, I left. And secondly, yes. Historically,
absolutely. And yet that is the only thing keeping the results of AI generated
code from devolving into an unmaintainable mess.

Always plan before writing a single line of code. And always do a code review
pass at the end with the mindset of
[how would I have done this differently?](https://lalitm.com/post/building-syntaqlite-ai/).

# Blackbird

I have a custom claude status line based on which workspace and git repo I'm
working in. I used a bunch of bird emoji to help differentiate (because Unicode
has a lot of <a class="link" data-x="1" data-y="-6">birds</a>).

But turns out the 🐦‍⬛ emoji causes issues. Specifically, that emoji is a
combination of the 🐦 and ⬛ with a zero width joiner in-between. And tmux does
not handle these well. Something to look out for.

# Lee Sedol

I found out recently, that Lee Sedol retired from playing Go in 2019 after
losing to AlphaGo in 2016. In an interview, he said:

> Even if I become the number one, there is an entity that cannot be defeated.

Back in high school (in like 2004 or 2005), I had a classmate that had played a
lot of RuneScape. He was one of the players that had accumulated 100s of party
hats and other ridiculously expensive items from early rune ore farming or
whatever. His philosophy was that if you couldn't be the best at something, why
bother.

In the current era of AI genuinely coding faster than me, and only getting
better, I've been thinking a lot about Lee Sedol and my old classmate's mindset.

# Code reviews

Doing code reviews used to be one of my favorite parts of being a tech lead. A
new engineer joins the team, I review their code, I provide feedback, they learn
from it, I see them grow as engineers, they're eventually better and more
knowledgeable than me.

Great loop. Rewarding. Less so now.

Instead, I'm reviewing Claude's code. Which is fine, I already mentioned above
that you absolutely need to do this. But you don't get to see Claude grow. Also
this doesn't really fell like being a SWE anymore. It's a new role. Like
Software Dispatcher or something.

Or alternatively, when I'm reviewing my coworkers code, more often than not, my
feedback just gets fed back into Claude and I don't see the same growth or
learning from the process.

And new engineers don't have the "how would I have done this?" learned yet,
since they haven't done it. So they have to rely more on how Claude did it,
which is less than ideal.

# Changing how I write

As mentioned in <a class="link" data-x="3" data-y="-6">how</a> and
<a class="link" data-x="6" data-y="-9">claude</a>, I will once again reiterate
that **this blog does not and will not use AI or LLMs to generate any of its
content.**

I feel like I need to include that caveat in every post I talk about using
Claude Code.

That said, I have found that even without using AI for writing these posts, it
is changing how I write. When doing code reviews, I used to write a lot like how
Claude sounds. And em dashes were great — even for folks that followed the
Chicago Manual of Style's awful opinion that there shouldn't be whitespace on
either side of them. Now I actively avoid things that make me sound like a
generic LLM.
