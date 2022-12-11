/**
 * Generates the blog.html panel based on other panels in the panels/ directory.
 *
 * Usage: `node ./codegen/refresh_blog.mjs`
 */

import { readdir, readFile, writeFile } from "node:fs/promises";
import { JSDOM } from "jsdom";

const filename = "./panels/blog.html";

const blogEntries = [];
const filenames = await readdir("panels/");
for (const filename of filenames.reverse()) {
  if (filename.indexOf("blog-") >= 0) {
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
    blogEntries.push(`
      <div class="blog-entry">
        ${date} -
        <span class="link" data-x="${xCoord}" data-y="${yCoord}">${title}</span>
      </div>`);
  }
}

console.log(`Updating ${filename}`);
await writeFile(
  filename,
  `<div
  class="panel blog-theme"
  data-x="0"
  data-y="-1"
  data-type="blog"
  data-url-suffix="blog"
>
  <div class="panel-content">
    <div class="title">Blog</div>
    <div class="blog-entries">${blogEntries.join("")}
    </div>
    <div class="nav-section">
      <span class="link nav-link" data-x="0" data-y="0">Home</span>
    </div>
  </div>
</div>`
);
