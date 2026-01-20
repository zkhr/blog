---
title: claude
coordinates: 6 -9
date: 2026-01-19
type: blog
navLinks:
  - 0 0 Home
  - 0 -1 Journal
  - 6 -8 Prev
---

So between a past coworker's recent recommendation, antirez's <a
href="https://antirez.com/news/158">Don't fall into the anti-AI hype</a> post a
week ago, and the internet not shutting up about how good Opus 4.5 is since it
<a href="https://www.anthropic.com/news/claude-opus-4-5">released in Nov</a>, I
decided to give Claude a try.

# Reminder

As mentioned in <a class="link" data-x="3" data-y="-6">how</a>, **This blog does
not and will not use AI or LLMs to generate any of its content.**

This is my personal immaterial journal. It's already pointless as it is. No
reason to make it even more meaningless by not even bothering to write it
myself.

# Caveat

I _had_ given Claude a quick look previously while working on my
<a class="link" data-x="4"
data-y="-9">Sherwalk</a> side project. After tediously transcribing three short
stories to conversations manually, I was curious if an LLM could handle this
task quicker or better.

And yeah, that was definitely in its wheelhouse. If I ever go back to that
project, I'll probably have Claude knock any of the remaining adventures that
would be interesting in that format.

# The project

My first prompt to Claude was:

> Suppose I wanted to write a Chrome extension to open Google Meet links
> automatically in a new tab when an event starts on my calendar in Google
> Calendar. Is it possible to build such an extension that can read my calendar
> via an official API? What might that look like?

(This is based on an internal extension at my last job, which I heavily relied
on. It helps make sure that you _don't be late_ to meetings).

# The process

The first response was 90% of the way there.

Next I had it generate a README which stepped me through the Google Cloud
Console nonsense, name the project **Meteion**, do some minor feature changes,
download and scale an icon for the extension, and update the code style to match
my personal preferences.

After that, there were a couple larger fixes. Some superfluous Promises wrapping
Promises that could be cleaned up and other similar sort of async code cleanups.
A security bug due to automatically opening any link someone put in the body of
any event on my calendar. Fixing an issue where the icon wasn't rendering in the
toolbar.

# The conclusion

The extension nearly works at time of writing. Claude (rightfully) assumed I was
using Chrome, so it used my logged in identity via
`chrome.identity.getAuthToken`. When I said I was using Vivaldi instead, it
swapped that out for a different flow via `chrome.identity.getRedirectURL`.

But this requires logging in every hour. ¯\\\_(ツ)_/¯

It seems the alternative would be spinning up a backend for this and using
refresh tokens via `chrome.identity.launchWebAuthFlow`, which I guess I could
do, but I was hoping the extension could be simpler and self-contained.

Anyways, it took less time for Claude to code it after my kiddo went to bed this
evening than it did for me to write this blog post after. So, um... yeah. As a
SWE, these are interesting times. Admittedly, this was a small greenfield
project, but the results were impressive nonetheless.

# The epilogue

This process felt a lot like doing code reviews for a junior SWE, except Claude
responded to my comments essentially instantly.

I wonder if we're moving to a world where every SWE is just a TLM for their own
team of AIs. I guess other roles on the team will have to increase in scope
accordingly.

Thankfully, I have the background to be able to find and cleanup bugs like those
mentioned above (I've reviewed a lot of code...), but I worry about new
engineers entering the field that will lean more heavily on the generated
output.

Maybe the AI will get better at handling the TLM responsibilities, as well. Time
will tell.
