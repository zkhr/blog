---
title: kotlin
coordinates: 0 -9
date: 2024-03-21
type: blog
navLinks:
  - 0 0 Home
  - 0 -1 Journal
  - 0 -8 Prev
  - 1 -9 Next
---

I started coding in Kotlin for a project recently and have mostly enjoyed its
philosophy and syntax. But I wanted to try and articulate my thoughts on
[extension functions](https://kotlinlang.org/docs/extensions.html#extension-functions)
because I'm not sure yet if I like them or hate them.

Other languages have supported extension methods for years, but most projects
I've worked on have been in languages without support (or at least without
idiomatic usage).

The super quick overview is that they let you add methods directly on classes
that can be imported independently of the original code. Read the docs linked
above for a better description.

I think I instinctively hated them, because coming from something like
javascript where this would be done via modifying the prototype, you have no
guarantees that you aren't clobbering some other code on the page. Or with
something like dependency injection where your framework makes data available
for you, but it isn't always easy to know where things are coming from without
decent tooling or prior knowledge of the codebase.

But neither of these are concerns in Kotlin. Handling for extension functions
occurs at compile time, so you don't have the same concerns around breaking
other parts of the codebase. And extensions are imported so its easy to find
where they source from.

I guess there is a worry that a poorly organized codebase could become even more
cumbersome to work with if past authors scattered different parts of an object
around incomprehensibly. But this seems like it would be easy enough to
reconcile and reason through.

On the flip side, I like the syntactic sugar it brings and the simplicity of
adding utility functions on top of core functionality that I don't own.

So I guess it's just the change aversion that comes with learning something new.
They'll probably grow on me as I learn all the shiny new best practices that
make use of them.
