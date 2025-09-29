---
title: roze
coordinates: 2 -5
date: 2023-01-10
type: blog
navLinks:
  - 0 0 Home
  - 0 -1 Journal
  - 3 -5 Prev
  - 1 -5 Next
---

<div class="section">
  <div class="quote ac-quote">
    <div>
      By creating a planetary network, mankind on Planet now has the ability
      to share information at light-speed. But by creating a single such
      network, each faction has brought themselves closer to discovery as
      well. At the speed of light, we will catch your information, tag it
      like an animal in the wild, and release it unharmed-if such should
      serve our purposes.
    </div>
    <div class="attribution">
      -- Datatech Sinder Roze
      <div>"The Alpha Codex"</div>
    </div>
  </div>
</div>

Over the pandemic, I've played a few asynchronous games of Civ 6 with friends,
using discord to keep track of whose turn it is. We wanted a way to automate
@mention'ing the next player, so we looked around.

There are a few github repos that have this functionality that you can clone and
run with, and there is an often cited
[reddit post](https://www.reddit.com/r/civ/comments/aqwwui/play_by_cloud_making_webhook_work_with_discord/)
that explains how to set up IFTTT for this, but there wasn't an easy way to add
a bot to your server and have it "just work".

Until now!

Introducing, [roze.run](https://roze.run), the self-proclaimed "premier way to
get turn notifications in Discord for Sid Meier's Civilization VI". This was a
fun weekend project, in that there are only a few moving parts, but it gets the
job done! Well mostly, Civ's webhook system has a bunch of issues that can
actually make it kinda flaky, but under certain circumstances it works well.

This project is named after Datatech Sinder Roze from the Alien Crossfire
expansion of one of my favorite games of all time:
[Sid Meier's Alpha Centauri](https://www.gog.com/en/game/sid_meiers_alpha_centauri).
As an aside, if you like 4x games and haven't played it, do yourself a favor,
close this blog, and buy it now. It is often on sale on gog and at time of
writing it is only $1.49. I've easily spent hundreds of hours over the last two
decades on this one game.

roze's site above has more details and her source is available on github in the
[zkhr/roze](https://github.com/zkhr/roze) repo.
