---
title: artifacts
coordinates: 2 -7
date: 2024-12-30
type: blog
navLinks:
  - 0 0 Home
  - 0 -1 Journal
  - 3 -7 Prev
  - 2 -6 Next
---

<div class="section">
  <div class="quote ac-quote">
    <div>
      Superior training and superior weaponry have, when taken together, a
      geometric effect on overall military strength. Well-trained,
      well-equipped troops can stand up to many more times their lesser
      brethren than linear arithmetic would seem to indicate.
    </div>
    <div class="attribution">-- Spartan Battle Manual</div>
  </div>
</div>

# Not the valve one.

After playing
<a class="link" data-x="3" data-y="-8">spacetraders</a> a few months ago, I've
once again found myself playing an API game. In
[Artifacts](https://artifactsmmo.com/), you're automating characters in an
mmorpg.

Last time around I wrote everything in JS to go fast, but wished I'd tried out
something new. This time around, I went with **Rust**.

I haven't used any languages with memory management since C/C++ at
<a class="link" data-x="3" data-y="-9">university</a>, so actually thinking
about the stack and heap and reference counting and all that was an interesting
change of pace.

For some definition of interesting. Was that a `&str` or a `String` that I
wanted?

# Read the book.

I don't remember what blog I found it on, but a few days into using Rust, I read
a comment like "you can't just jump into using Rust, you have to read _the
book_". Whoops, I guess.

# Personas.

My implementation for artifacts is pretty similar to what I'd done for
spacetraders with personas I could attach to my characters, but just a different
set of tasks. Usually characters stuck to a specific persona, but sometimes I
would have them all do the same one overnight (e.g. to get a bunch of resources
or level up). The ones I ended up settling on were:

The **Crafter** persona to make weapons, gear, or jewelry.

The **Gatherer** persona to chop wood and mine ore.

The **Fighter** persona for characters to farm individual monsters or tasks
coins.

The **Angler** persona to fish and cook.

At one point I also had a **Chicken Chaser** that just battled chickens.

# Rust positives.

As a fan of `Optional` introduced recently in Java 8 (okay so I guess 2014 isn't
considered recent anymore, but at least that isn't as old as that chicken chaser
reference (Fable came out in 2004) and I did have a coworker whose license plate
was JAVA 8, but that's unrelated) as a way of making code more explicit and
readable, Rust's `Option` is pretty handy as well. `Result` is handy for similar
reasons.

Spinning up and coordinating multiple threads was super painless. If something
went wrong with one of them during the night, the other characters could still
do their thing.

`loop {}` is rad.

Grabbing code from other crates was relatively straightforward. I used chrono
(for dealing with time stuff), reqwest (for making the API calls), and serde
(for handling json).

Error messages during compilation are excellent. No notes. For someone totally
new to the language, they provided great starting points for learning more.

# Skies.

My five characters are named after protagonists from Skies of Arcadia, the best
RPG ever made (when wearing my particular set of nostalgia goggles): Vyse, Aika,
Fina, Enrique, and Drachma.

It is surprising that in ~2 years of doing this blog I haven't written anything
about that game yet. Guess I have to replay it in 2025.
