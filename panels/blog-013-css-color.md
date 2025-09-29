---
title: "css: color"
coordinates: 1 -4
date: 2023-01-28
type: blog
navLinks:
  - 0 0 Home
  - 0 -1 Journal
  - 1 -5 Prev
  - 0 -4 Next
---

Suppose we wanted a blue block:

<div class="block" style="background: blue"></div>

How would you specify its color in CSS? Well, let's start by rolling the clock
back to 1996. Independence Day started airing in theaters, Game Freak launched
Pokemon Red and Blue, Sid Meier released Civ II, and W3C published the first
specification for CSS.

# Cascading Style Sheets, Level 1

Per the [CSS1](https://www.w3.org/TR/CSS1/) specs, we could write this using a
color name, such as `background: blue`. The 16 original named colors are
<span class="named-color" style="background: black">black</span>,
<span class="named-color" style="background: silver">silver</span>,
<span class="named-color" style="background: gray">gray</span>,
<span class="named-color" style="background: white; color: black"
        >white</span >,
<span class="named-color" style="background: maroon">maroon</span>,
<span class="named-color" style="background: red">red</span>,
<span class="named-color" style="background: purple">purple</span>,
<span class="named-color" style="background: fuchsia">fuchsia</span>,
<span class="named-color" style="background: green">green</span>,
<span class="named-color" style="background: lime; color: black"
        >lime</span >,
<span class="named-color" style="background: olive">olive</span>,
<span class="named-color" style="background: yellow; color: black"
        >yellow</span >,
<span class="named-color" style="background: navy">navy</span>,
<span class="named-color" style="background: blue">blue</span>,
<span class="named-color" style="background: teal">teal</span>, and
<span class="named-color" style="background: aqua; color: black"
        >aqua</span >.

But one might want to use more than a few predefined colors. Well, you can also
specify one of the ~16.7 million colors in the
[sRGB color space](https://en.wikipedia.org/wiki/SRGB), which allows defining a
color by its red, green, and blue channels. Instead of using the named color,
you can use one of the following:

- `background: #00f` - a 3-digit hex code
- `background: #0000ff` - a 6-digit hex code
- `background: rgb(0, 0, 255)` - an integer rgb() value (from 0 to 255)
- `background: rgb(0%, 0%, 100%)` - a float rgb() from 0.0% to 100.0%

# Cascading Style Sheets, Level 2

The [CSS2](https://www.w3.org/TR/1998/REC-CSS2-19980512/) and
[CSS2.1](https://www.w3.org/TR/2011/REC-CSS2-20110607/) standards didn't change
too much in the way that developers could specify colors, except the addition of
<span class="named-color" style="background: orange">orange</span> as a new
named color. So let's move on.

# CSS Color Module Level 3

After CSS2 (which was one large spec for all of CSS), W3C switched to using
smaller documents for different modules. The
[CSS Color Module Level 3](https://www.w3.org/TR/css-color-3/) introduced a few
things.

130 new
[named colors](https://developer.mozilla.org/en-US/docs/Web/CSS/named-color)
were added (with some overlaps like
<span class="named-color" style="background: dimgray">dimgray</span> and
<span class="named-color" style="background: dimgrey">dimgrey</span>).

To specify an opacity for an element, rgba() was added. It takes a 4th parameter
for an alpha channel: `background: rgba(0, 0, 255, 0.5)`.

CSS Color 3 also added hsl() and hsla(), which use hue, saturation, and
lightness. If you haven't seen this before, let's take a look at how this works.

Without invoking physics or just shouting the word color over and over, **hue**
is pretty hard to define, but really easy to understand. It's where in that
ROYGBIV wheel the color lands:

<div class="long-block"
     style="background: linear-gradient(
       90deg,
       hsl(0deg, 100%, 50%),
       hsl(30deg, 100%, 50%),
       hsl(60deg, 100%, 50%),
       hsl(90deg, 100%, 50%),
       hsl(120deg, 100%, 50%),
       hsl(150deg, 100%, 50%),
       hsl(180deg, 100%, 50%),
       hsl(210deg, 100%, 50%),
       hsl(240deg, 100%, 50%),
       hsl(270deg, 100%, 50%),
       hsl(300deg, 100%, 50%),
       hsl(330deg, 100%, 50%),
       hsl(0deg, 100%, 50%));"></div>

**saturation** tells how vibrant the color is:

<div class="long-block"
     style="background: linear-gradient(
       90deg,
       hsl(240deg, 0%, 50%),
       hsl(240deg, 100%, 50%));"></div>

**lightness** tells how light or dark the shade of the color is:

<div class="long-block"
     style="background: linear-gradient(
       90deg,
       hsl(240deg, 100%, 0%),
       hsl(240deg, 100%, 50%),
       hsl(240deg, 100%, 100%));"></div>

Putting these together, we get something like the following grid, with
saturation on the x-axis and lightness on the y-axis (if we pick a single hue,
like blue):

<div class="square-block hsl-block"></div>

# CSS Color Module Level 4

[CSS Color Module Level 4](https://www.w3.org/TR/css-color-4/) introduces
several new and interesting things.

For starters, rgb() and hsl() syntax has been updated so that they no longer use
commas and can optionally provide an alpha value after a forward slash:
`background: rgb(0 0 255 / 50%)`.

Hex codes also support alpha channels with 4 digit and 8 digit hex codes:
`#0000ff80`.

As an alternative to specifying color via rgb() or hsl(), there are 5 additional
color functions introduced: hwb(), lab(), lch(), oklab(), oklch().

The **hwb()** functional notation expresses a given color according to its hue,
whiteness, and blackness. Hue is the same as the hue used in hsl(). The
whiteness and blackness refer to how much white or black get mixed in.

For example, we can look at the square below and see how adding whiteness or
blackness changes the color, with blackness on the x-axis and whiteness on the
y-axis (again picking a single hue).

<div class="square-block hwb-block"></div>

The last 4 ( **lab()**, **lch()**, **oklab()**, and **oklch()** ) are similar to
hsl(), but better map to human perception of lightness (versus using the same
scales for all hues like in hsl()). These aren't available in all browsers yet,
but will be worth checking out (especially when
[CSS Color Module Level 5](https://www.w3.org/TR/css-color-5/) brings native
relative colors to CSS).
