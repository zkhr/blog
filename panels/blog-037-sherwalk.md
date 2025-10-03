---
title: sherwalk
coordinates: 4 -9
date: 2025-10-02
type: blog
navLinks:
  - 0 0 Home
  - 0 -1 Journal
  - 4 -8 Prev
---

During <a class="link" data-x="5" data-y="-7">week 0</a>, I started working on
my Sherwalk idea from <a class="link" data-x="0" data-y="-6">project ideas
i</a>.

Sherwalk is a game based on the works of Sir Arthur Conan Doyle. By traveling
around Victorian London, you get to explore some of Sherlock Holmes most famous
mysteries. But in order to take steps in the game, you need to walk around in
the real world.

The game does not use your GPS or location, does not have any in-app purchases,
and does not have any ads.

I got it to a pretty good state a month ago with its first three adventures:
_The Red-Headed League_, _The Adventure of Silver Blaze_, and _The Adventure of
the Speckled Band_.

There is tons of room for improvement, but after not touching it for about a
month, I figured I should probably put it out there and see if there is any
interest in me building it out further and adding new features or adventures.

You can check out the website for the app at https://sherwalk.com or download it
for iOS on the [app store](https://apps.apple.com/us/app/sherwalk/id6751060871).

I already wrote a little bit in that _week 0_ post about my very first
impressions of developing in Swift, but here are a few more thoughts about the
Sherwalk app development experience in no particular order:

# It is easy to try and sell stuff

[StoreKit](https://developer.apple.com/documentation/storekit) makes it
ridiculously easy to add in-app purchases.

I originally figured I'd release the game with a few free adventures and the
rest behind an in-app upsell (which I called `sherunlock`). But then after only
implementing three before moving on to other side projects, I just got rid of
the paywall.

But yeah, Apple makes this easy. I just had to add an entry in App Store Connect
(the website where you manage your apps) and add a few lines of code to connect
the purchase to a state that tracked locally whether or not the game was
sherunlocked.

# Writing mystery configurations

My first prototype had the mystery and chat configurations stored in json. Which
was fine, but very repetitive with lots of duplication and boilerplate.

If I was still at _the company_ I probably would have used a **GCL** config to
manage those issues (and there are similar external configuration languages like
Jsonnet). However in the Swift/iOS ecosystem, the canonical approach seemed to
be to create a Domain Specific Language (or **DSL** for short).

<span class="secondary-text">(Aside: There isn't much about GCL on the internet;
however, Google's
[borg paper](https://research.google.com/pubs/archive/43438.pdf) from 2015
references an
[MS thesis](https://pure.tue.nl/ws/portalfiles/portal/46927079/638953-1.pdf)
from 2008 that provides a little info.)</span>

Anyways, using a DSL worked out pretty well. I was able to encode mysteries and
conversations in a very simple syntax, with additional metadata as needed:

```
extension Chat {
  static let RHL_0 = Chat("rhl.0") {
    Message(.Holmes) {
      "You could not possibly have come at a better time, my dear Watson."
    }
    Message(.Watson) {
      "I was afraid that you were engaged."
    }
    ...
  }
  ...
}
```

# Testing and sharing the app was simple

Apple provides [TestFlight](https://developer.apple.com/testflight/) to share
developer builds of your app with other people.

This let me write my app in Xcode, create a build, hop over to that App Store
Connect site, push a few buttons, and then anyone I'd allowlisted could download
it from the TestFlight app on their phone.

Significantly easier than I was expecting and a very well designed end-to-end
user journey.

# The app review process

Pretty painless too. Submitted for approval earlier today and got my **Welcome
to the App Store** email before going to bed.
