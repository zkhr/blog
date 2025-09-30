# ari.blumenthal.dev

This is repo contains the source for https://ari.blumenthal.dev (the personal
website of this repo's owner).

## Project structure

Let's walk through the key files and folders in this project:

```
blog/
├── common/              # Defines shared code (for codegen and FE)
├── dist/                # Generated static content served by the FE
├── panels/              # Contains all panels renderable by the FE
├── src/                 # Contains the FE TS code.
├── static/              # Additional static content (css, fonts, images, misc)
├── .gitignore           # Files that aren't tracked by git
├── build.ts             # Generates the dist/ directory
├── deno.json            # Deno (runtime & package mgr) config and tasks
├── deno.lock            # Deno lock file for checking module integrity
├── dev.ts               # Starts a local dev server
├── panels.ts            # Renders the markdown panels as html
```

## Prerequisites

ari.blumenthal.dev is rendered by the [Deno](https://docs.deno.com) JS runtime.
It can then be served by any frontend that serves static content (e.g. the
provided dev server, nginx, etc).

## Testing and development

For running the server in your local environment, run:

```sh
$ deno run dev
```

This will spun up the `dev.ts` server for your FE on port 8000 and watch for any
local changes.

## Running the FE

To build the server for production (i.e. generate or update the `dist/`
directory), run:

```sh
$ deno run build
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
