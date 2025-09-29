---
title: godot
coordinates: 1 -9
date: 2024-04-10
type: blog
navLinks:
  - 0 0 Home
  - 0 -1 Journal
  - 0 -9 Prev
  - 1 -8 Next
---

# I

I started to play around with the [Godot](https://godotengine.org) game engine a
few days ago, since I have some ideas for games I'd like to make. Whether or not
any of them come to fruition is still tbd, but I decided to give it a go to see
what comes of it.

I searched a little bit about each of the major engines these days (godot,
unity, unreal, etc) and for the sort of 2D games I'd be working on (and the
positive feedback from developers that use it), Godot 4.2 with GDScript seemed
like a pretty good fit to try out.

To learn the basics, I did the intro "dodge the creeps" game in their docs and
then tasked myself with implementing solitaire. Not trivial, but not super
complex either.

# II

This isn't my first foray into game development. Twice before I've made a few
simple games.

As a kid, I learned Visual Basic and used that for assorted projects. One was a
game where a box would jump around the screen and you had to click it to
progress.

Later in high school, I took an intro class that I vaguely recall had me make
some game in Java to learn OOP, but I can't recall offhand anymore what it
entailed.

# III

So I got the solitaire game working.

And then I remembered, I don't really like solitaire.

I prefer freecell.

# IV

Most of the programming was pretty straightforward and provided a good
opportunity to learn the Godot UI, GDScript syntax and all that.

There was an interesting issue I ran into around handling a click event that
overlapped with multiple `Area2D` nodes (e.g. when dragging a card that was on
top of another draggable card). I originally used the input event signals, but I
had no way of figuring out which one should handle the event (no deterministic
order I could figure out as to which node triggered first or to prevent
propagation).

I eventually stumbled upon the
[intersect_point](https://docs.godotengine.org/en/stable/classes/class_physicsdirectspacestate2d.html#class-physicsdirectspacestate2d-method-intersect-point)
function I could use to get a list of everything that overlapped with the click
and filter that by z-index to get the node I wanted.
