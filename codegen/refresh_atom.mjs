/**
 * Generates an atom feed containing the most recent 20 posts.
 *
 * Usage: `node ./codegen/refresh_atom.mjs`
 */

import { readdir, readFile, writeFile } from "node:fs/promises";
import { JSDOM } from "jsdom";

const rssFilename = "./rss";

const blogEntries = [];

const filenames = await readdir("panels/");
let count = 0;
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
  const suffix = panel.dataset.urlSuffix;
  let content = [...panel.querySelectorAll(".section, .section-header")]
    .map((x) => x.textContent.replace(/\s+/g, " ").trim())
    .join("</p><p>");
  content = `<p>${content}</p>`
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const url = `https://ari.blumenthal.dev/!/${xCoord}/${yCoord}/${suffix}`;

  blogEntries.push(
    `  <entry>
    <title>${title}</title>
    <link href="${url}"/>
    <id>${url}</id>
    <updated>${date}T12:34:56Z</updated>
    <content type="html">${content}</content>
  </entry>`
  );

  count++;
  if (count >= 20) {
    break;
  }
}

console.log(`Updating ${rssFilename}`);
await writeFile(
  rssFilename,
  `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>ari.blumenthal.dev</title>
  <link href="https://ari.blumenthal.dev/" />
  <link href="https://ari.blumenthal.dev/rss" rel="self" />
  <updated>${new Date().toISOString()}</updated>
  <author>
    <name>Ari Blumenthal</name>
  </author>
  <id>https://ari.blumenthal.dev/rss</id>
${blogEntries.join("\n")}
</feed>`
);
