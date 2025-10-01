# ari.blumenthal.dev

This is repo contains the source for https://ari.blumenthal.dev (the personal
website of this repo's owner).

## Project structure

Let's walk through the key files and folders in this project:

```
blog/
├── client/              # Contains the code running on visitor's devices
│   ├── css/             # SASS code (to be compiled compiled to CSS)
│   └── js/              # Client-side TS code (to be compiled to JS)
├── common/              # Defines code shared between clients and the frontend
├── dist/                # Generated static content (served by the frontend)
├── frontend/            # Server-side TS code (for running the frontend)
├── panels/              # Contains all renderable panels
├── public/              # Additional static content
│   ├── fonts/
│   ├── images/
│   └── misc/
├── .gitignore           # Files that aren't tracked by git
├── deno.json            # Deno (runtime & package mgr) config and tasks
└── deno.lock            # Deno lock file for checking module integrity
```

## Prerequisites

ari.blumenthal.dev is served by the [Deno](https://docs.deno.com) JS runtime.

## Running the FE

To run the server (i.e. update static content, respond to requests, and watch
for any local changes), run:

```sh
$ deno run app
```

## FAQ

### What are panels?

Panels are markdown content with
[YAML Front Matter](https://jekyllrb.com/docs/front-matter/) that provide
metadata about where they exist in the 2D grid that is my website.

The YAML is stripped and parsed using the
[jonschlinkert/gray-matter](https://github.com/jonschlinkert/gray-matter)
library. The remaining markdown content is rendered with the
[markedjs/marked](https://github.com/markedjs/marked) library.

### Why not use _POPULAR FRAMEWORK_ instead?

There are often better, faster, or easier ways to do a lot of this stuff. But
hey, this is my personal blog. It's for me to try out new things, learn
something, have fun, etc.

### No one is asking these questions.

Fair. Although, I suppose this is neither frequent, asked, or a question.
