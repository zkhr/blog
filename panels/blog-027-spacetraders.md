---
title: spacetraders
coordinates: 3 -8
date: 2024-08-17
type: blog
navLinks:
  - 0 0 Home
  - 0 -1 Journal
  - 3 -9 Prev
  - 3 -7 Next
---

<div class="section">
  <div class="quote ac-quote">
    <div>
      And so we return again to the holy void. Some say this is simply our
      destiny, but I would have you remember always that the void EXISTS,
      just as surely as you or I. Is nothingness any less a miracle than
      substance?
    </div>
    <div class="attribution">
      -- Sister Miriam Godwinson
      <div>"We Must Dissent"</div>
    </div>
  </div>
</div>

[Spacetraders](https://spacetraders.io) is a "space-themed economic game with
HTTP endpoints for automating gameplay and building custom tools." It's had me
hooked during the evenings the last couple weeks in a "just one more turn" sort
of way.

# UI

I kicked off with a minimal web frontend to explore the mechanics of the game.
Specifically, I built three pages to get started:

A **market** UI where I could see all the waypoints with markets and what goods
they were importing and exporting.

A **fleet** UI where I could see the status of my ships, have them mine an
asteroid, refuel as needed, transfer cargo to other ships, or fly around the
system.

An **rpc builder** UI where I could hit arbitrary endpoints to fill the gaps for
things that I hadn't added in my other pages (buying ships, handling contracts,
etc).

# Automation

Once I got the hang of the intro mechanics to the game, I started building some
basic automation. This was done with a nodejs server that tells the fleet what
to do.

Each ship is given a persona that assigns it an event loop which contains a
sequence of actions to repeat indefinitely. I currently have five personas in
use:

The **Hauler** persona (for my freighters) which has them fly to an asteroid,
load from other ships until their inventory is full, and sell their cargo at a
nearby market.

The **Miner** persona (for my drones) which has them fly to an asteroid and mine
whenever they have cargo space.

The **Pricer** persona (for my probes) which has them fly in a loop around the
different markets and stores the prices of goods in a postgres db. This uses a
naïve nearest neighbor algorithm for generating the route.

The **Trader** persona (for my frigate) which has it find the most profitable
good in the system, pick it up at one waypoint and sell it at another.

The **NOOP** persona for ships I have stationed at a particular waypoint (e.g.
so I can buy ships at its shipyard, etc).

# Current Status

The game is an alpha, so the server resets every ~3 weeks. The last reset was on
2024-08-11 (I started playing a little before then) and my handle for this reset
is **ZAKHAROV**.

At time of writing, I have ~1.5 million credits which puts me 14th on the
leaderboard for this reset (mind you there are very likely more players that
have more credits than me if you include the cost of their ships (and 1st is
currently at ~500 million, so there is that)).

My fleet consists of 21 ships: 1 frigate, 4 probes, 1 shuttle, 3 freighters, and
12 drones.

# What's Next

There are several directions I could go from here. Some ideas in no particular
order:

- Add ship information to my DB and build a live visualization of where all my
  ships are at any given time.
- Add a queueing server between my API calls and the game server, to avoid
  hitting the dreaded "You have reached your API limit" errors.
- Explore more mechanics of the game (visiting other system, market dynamics,
  etc).
- Port my codebase to another language. I built this out quickly using JS, but
  it could be fun to try out Rust or Elixir or something well suited to this
  sort of project.
