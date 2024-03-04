/**
 * Generates the blogroll.html panel based on the static/misc/feeds.opml file.
 *
 * Usage: `node ./codegen/refresh_blogroll.mjs`
 */

import { readFile, writeFile } from "node:fs/promises";
import sax from "sax";

const inputFilename = "./static/misc/feeds.opml";
const outputFilename = "./panels/blogroll.html";

const listItems = [];
const parser = sax.parser(/* strict= */ true);
parser.onopentag = (node) => {
  if (node.name !== "outline") return;

  if (node.attributes.type === "rss") {
    listItems.push(
      `<div class="feed">${node.attributes.text} (<a href="${node.attributes.htmlUrl}">html</a>, <a href="${node.attributes.xmlUrl}">xml</a>)</div>`
    );
  } else {
    listItems.push(`<div class="feed-header">${node.attributes.text}</div>`);
  }
};

const inputData = await readFile(inputFilename, { encoding: "utf8" });
parser.write(inputData).close();

console.log(`Updating ${outputFilename}`);
await writeFile(
  outputFilename,
  `<div
  class="panel boardgame-theme"
  data-x="-1"
  data-y="1"
  data-type="boardgame"
  data-url-suffix="blogroll"
>
  <div class="panel-content">
    <div class="title">Blogroll</div>
    <div class="section">RSS feeds I follow.</div>
    <div class="section">${listItems.join("")}</div>
    <div class="section footnote">
      Generated from an <a href="/static/misc/feeds.opml">opml file</a> exported from Reeder.
    </div>
    <div class="nav-section">
      <span class="link nav-link" data-x="0" data-y="0">Home</span>
    </div>
  </div>
</div>`
);
