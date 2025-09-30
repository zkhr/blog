---
title: week 0
coordinates: 5 -7
date: 2025-08-11
type: blog
navLinks:
  - 0 0 Home
  - 0 -1 Journal
  - 5 -6 Prev
  - 4 -7 Next
---

As mentioned in
<a class="link" data-x="5" data-y="-6">an update on</a> last week, I left my
job.

After over a decade working for _the company_, there's a lot I'll miss. But the
three at the top of my mind right now are:

1. My phenomenal coworkers, who I learned so much from over the years
1. My work notes/journals, which I no longer have access to
1. Memegen.

There's not much I can do about (1) and (3) right now, but for (2), I've started
using **Obsidian** to keep daily notes of what I'm working on, design docs for
side projects, and miscellaneous learnings as I navigate the tech stacks I'm
[less familiar with](https://github.com/jhuangtw/xg2xg).

This journal entry is a collection of various interesting (to me) notes from my
personal logs over the last week.

# Project ideas

The hardest part of a new project is coming up something that lies in the
intersection in the venn diagram of being

- An interesting idea to work on
- A tech stack that I either know really well or want to learn
- Something that others would find fun or helpful to use

I had an idea in
<a class="link" data-x="0" data-y="-6">project ideas i</a> called **Sherwalk
Holmes** that I've started tinkering with, since it seems like it _might_ hit
all those criteria.

# The Web

I switched over to the **Vivaldi** browser, since I no longer work at _the
company_ and Safari and Chrome both have issues that I find aggravating.

For example, in Safari, dynamic favicons on desktop often show stale versions of
themselves, due to how they're cached. See
[this post](https://apple.stackexchange.com/questions/339350/safari-12-favicon-in-gmail-tab-shows-incorrect-e-mail-count)
on Stack Overflow from 2018! Also, forward and back buttons on my mouse
[aren't supported](https://apple.stackexchange.com/questions/400080/make-safari-use-normal-back-and-forward-button-as-other-browser).
And on mobile, I'll frequently get into a state where the back button navigation
is buggy.

In Chrome, more and more AI features are getting pushed into the browser layer,
which is not my preference. On the other hand, Vivaldi has explicitly
[stated](https://vivaldi.com/for-a-better-web/): _"We don’t buy into the idea
that everything needs to be powered by AI. Especially not the kind that uses
your data without permission, or plagiarizes and pollutes the web with
misinformation."_

That said, I really like the look of the liquid glass version of mobile Safari
in the iOS 26 dev beta. I might be convinced to switch back to that...

# Vim keybindings

It's funny (to me) that one of the first things I have to switch over in any new
text editor (Obsidian, XCode, VS Code, etc) is to vim keybindings.

I say that as I'm typing this journal entry in vim.

Muscle memory is a crazy thing.

# Swift

My first impressions of developing in Swift are mostly positive. I like a lot of
the syntactic sugar that it has (guard clauses, for-when, implicit member
expression (aka the leading dot syntax), etc).

It sucks that I have to fallback from SwiftUI to UIKit for some seemingly
obvious things (e.g. changing the tint color of indicators in a `TabView`).

There is a mix of really solid documentation and tutorials, and absolute garbage
that hasn't been updated as functionality changes. For example, I banged my head
longer than I care to admin on installing custom fonts, because
[the official docs](https://developer.apple.com/documentation/swiftui/applying-custom-fonts-to-text/)
are wrong! You don't specify the full path to the font. Just the filename.

If you somehow made your way to this journal post from a search just because of
this issue, let me give you more details. The _Fonts provided by application_
under _Custom iOS Target Properties_ on the Info tab should just be the filename
of your font, irregardless of where in your directory structure the file is.
Also note that you have to edit it via that menu, if you update the `Info.plist`
manually, it won't work.

# What's up next?

I've got some basic data models and the intro flow of Sherwalk, as well as the
ability to pull step count data from HealthKit, and some minimal mocks in Figma
done already. I hope to get an end-to-end demo out this week in the hands of
some of my friends for some early testing and feedback.
