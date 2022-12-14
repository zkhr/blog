/**
 * Generates the index.html panel with all available panels in the panels/
 * directory.
 *
 * Usage: `node ./codegen/refresh_index.mjs`
 */

import { readdir, readFile, writeFile } from "node:fs/promises";

const filename = "./index.html";

const panels = [];
const filenames = await readdir("panels/");
for (const filename of filenames) {
  panels.push(`
      <!--# include file="panels/${filename}" -->`);
}

console.log(`Updating ${filename}`);
await writeFile(
  filename,
  `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>ari.blumenthal.dev</title>
    <meta
      name="description"
      content="Ari's personal blog. A mix of old and new side projects, being a new father, games I'm playing, and other similar sorts of things."
    />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
    />
    <link rel="icon" href="/favicon.png" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link type="text/css" rel="stylesheet" href="/static/css/main.css" />
  </head>
  <body>
    <div id="panel-matrix" style="display: none">${panels.join("")}
    </div>
    <script type="module" src="/static/js/bootstrap.js"></script>
  </body>
</html>`
);
