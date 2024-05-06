/**
 * Generates the blog.html panel based on other panels in the panels/
 * directory.
 *
 * Usage: `node ./codegen/refresh_journal.mjs`
 */

import { readdir, readFile, writeFile } from "node:fs/promises";
import { JSDOM } from "jsdom";

const blogFilename = "./panels/blog.html";

const blogEntries = [];

const filenames = await readdir("panels/");
for (const filename of filenames.reverse()) {
  const isBlog = filename.indexOf("blog-") >= 0;
  if (!isBlog) {
    continue;
  }

  const htmlContent = await readFile(`panels/${filename}`, {
    encoding: "utf8",
  });
  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;
  const panel = document.querySelector(".panel");
  const date = panel.querySelector(".blog-date").textContent;
  const title = panel.querySelector(".title").textContent;
  const xCoord = panel.dataset.x;
  const yCoord = panel.dataset.y;
  blogEntries.push(
    `<div class="blog-entry">
      <div class="blog-entry-date">${date} -</div>
      <div class="link" data-x="${xCoord}" data-y="${yCoord}">${title}</div>
    </div>`
  );
}

console.log(`Updating ${blogFilename}`);
await writeFile(
  blogFilename,
  `<div
  class="panel blog-theme"
  data-x="0"
  data-y="-1"
  data-type="blog"
  data-url-suffix="blog"
>
  <div class="panel-content">
    <div class="title">Journal</div>
    <div class="subtitle">read below or via <a href="/rss">rss</a></div>
    <div class="blog-entries">${blogEntries.join("")}
    </div>
    <div class="nav-section">
      <span class="link nav-link" data-x="0" data-y="0">Home</span>
    </div>
  </div>
</div>`
);
