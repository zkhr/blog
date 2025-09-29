---
title: booggle
coordinates: 0 -3
date: 2022-11-29
type: blog
navLinks:
  - 0 0 Home
  - 0 -1 Journal
  - 0 -2 Prev
  - 1 -3 Next
---

Several years ago, I created the side project I still use the most.

**booggle** is a
[fictional ghost](https://en.wikipedia.org/wiki/Boo_(character)) inspired web
implementation of a
[popular word game](https://boardgamegeek.com/boardgame/1293/boggle) involving a
4x4 grid of letters. Designed to be played by me and my then girlfriend (now
wife), it helps kill a few minutes pretty much whenever we need.

The application was built using a minimal [nodejs](https://nodejs.org/) server
(with [express](https://expressjs.com/)) that tracks users coming and going,
handles state for games that are in progress, checks words against a dictionary
as users are playing, and provides scoring at the end.

On the client, I used mostly vanilla javascript with
[handlebars](https://handlebarsjs.com/). Simple json messages are passed between
the client and server via a
[websocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API).

Want to try it out? It runs over at
[ari.blumenthal.dev/booggle](https://ari.blumenthal.dev/booggle). It's a little
buggy, only one game can be played at a time, the dictionary isn't perfect, but
hey, anyone can play.

Source for booggle is now available over on my github at
[github.com/zkhr/booggle](https://github.com/zkhr/booggle).
