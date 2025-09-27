/**
 * Prerenders the site content.
 *
 * Usage: `deno run codegen`
 */

import { DOMParser, HTMLDocument } from "jsr:@b-fuze/deno-dom";
import * as sass from "npm:sass-embedded";

interface JournalPanel {
  title: string;
  date: string;
  doc: HTMLDocument;
  x: string;
  y: string;
  urlSuffix: string;
}

/** The destination directory, which can be served to render the frontend. */
const DIST_DIR = "./dist";

try {
  await Deno.remove(DIST_DIR, { recursive: true });
} catch (_) {
  // If we couldn't remove the directory, it probably didn't exist yet.
}

await copyStaticContentToDist();
await copyPanelsToDist();

const journalPanels = await loadJournalPanels();

await buildJournalPanel(journalPanels, `${DIST_DIR}/panels/journal.html`);
await buildAtomFeed(journalPanels, `${DIST_DIR}/rss`);
await buildBlogroll(`${DIST_DIR}/panels/blogroll.html`);
const cssFilename = await compileCss();
await buildIndex(`${DIST_DIR}/index.html`, cssFilename);

/** Copies all static content to the dist/ directory. */
async function copyStaticContentToDist() {
  const staticDirs = ["fonts", "images", "js", "misc"];
  for (const staticDir of staticDirs) {
    const src = `./static/${staticDir}`;
    const dest = `${DIST_DIR}/${staticDir}`;
    console.log(`Copying ${src} to ${dest}`);
    await Deno.mkdir(dest, { recursive: true });
    for await (const file of Deno.readDir(src)) {
      Deno.copyFile(`${src}/${file.name}`, `${dest}/${file.name}`);
    }
  }
}

/** Copies all source panels to the dist/ directory. */
async function copyPanelsToDist() {
  const src = `./panels`;
  const dest = `${DIST_DIR}/panels`;
  console.log(`Copying ${src} to ${dest}`);
  await Deno.mkdir(`${DIST_DIR}/panels`, { recursive: true });
  for await (const file of Deno.readDir("./panels")) {
    Deno.copyFile(`./panels/${file.name}`, `${DIST_DIR}/panels/${file.name}`);
  }
}

/** Returns the blog panels in reverse chronological order. */
async function loadJournalPanels(): Promise<JournalPanel[]> {
  const panels = [];
  for await (const file of Deno.readDir(`${DIST_DIR}/panels`)) {
    const isBlog = file.name.indexOf("blog-") >= 0;
    if (!isBlog) {
      continue;
    }

    const htmlContent = await Deno.readTextFile(`./panels/${file.name}`);
    const doc = new DOMParser().parseFromString(htmlContent, "text/html");
    const panel = doc.querySelector(".panel");
    const date = panel?.querySelector(".blog-date")?.textContent;
    const title = panel?.querySelector(".title")?.textContent;
    const x = panel?.dataset.x;
    const y = panel?.dataset.y;
    const urlSuffix = panel?.dataset.urlSuffix;
    if (!date || !title || !urlSuffix || !x || !y) {
      console.log("Skipping ${file.name}");
      continue;
    }
    panels.push({ title, date, doc, x, y, urlSuffix });
  }

  return panels.sort((a, b) => b.date.localeCompare(a.date));
}

/** Generates the journal overview panel using the provided panels. */
async function buildJournalPanel(panels: JournalPanel[], filename: string) {
  console.log(`Building ${filename}`);

  const blogEntries = [];
  for (const panel of panels) {
    blogEntries.push(
      `<div class="blog-entry">
        <div class="blog-entry-date">${panel.date} -</div>
        <div class="link" data-x="${panel.x}" data-y="${panel.y}">${panel.title}</div>
      </div>`,
    );
  }

  await Deno.writeTextFile(
    filename,
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
    <div class="blog-entries">
      ${blogEntries.join("\n      ")}
    </div>
    <div class="nav-section">
      <span class="link nav-link" data-x="0" data-y="0">Home</span>
    </div>
  </div>
</div>`,
  );
}

/** Generates the atom feed using the provided panels. */
async function buildAtomFeed(panels: JournalPanel[], filename: string) {
  console.log(`Building ${filename}`);
  const entries = [];
  let count = 0;
  for (const panel of panels) {
    let content = [...panel.doc.querySelectorAll(".section, .section-header")]
      .map((x) => x.textContent.replace(/\s+/g, " ").trim())
      .join("</p><p>");
    content = `<p>${content}</p>`
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    const url =
      `https://ari.blumenthal.dev/!/${panel.x}/${panel.y}/${panel.urlSuffix}`;

    entries.push(
      `<entry>
    <title>${panel.title}</title>
    <link href="${url}"/>
    <id>${url}</id>
    <updated>${panel.date}T12:34:56Z</updated>
    <content type="html">${content}</content>
  </entry>`,
    );

    count++;
    if (count >= 20) {
      break;
    }
  }

  await Deno.writeTextFile(
    filename,
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
  ${entries.join("\n  ")}
</feed>`,
  );
}

async function buildBlogroll(filename: string) {
  console.log(`Building ${filename}`);

  const xmlContent = await Deno.readTextFile(`./static/misc/feeds.opml`);
  const doc = new DOMParser().parseFromString(xmlContent, "text/html");
  const outlines = doc.querySelectorAll("outline");
  const entries: string[] = [];
  for (const outline of outlines) {
    const text = outline.getAttribute("text");
    if (outline.getAttribute("type") === "rss") {
      const htmlUrl = outline.getAttribute("htmlUrl");
      const xmlUrl = outline.getAttribute("xmlUrl");
      entries.push(
        `<div class="feed">${text} (<a href="${htmlUrl}">html</a>, <a href="${xmlUrl}">xml</a>)</div>`,
      );
    } else {
      entries.push(`<div class="feed-header">${text}</div>`);
    }
  }

  await Deno.writeTextFile(
    filename,
    `<div
  class="panel grid-theme light-purple-grid"
  data-x="-1"
  data-y="1"
  data-type="light-purple"
  data-url-suffix="blogroll"
>
  <div class="panel-content">
    <div class="title">Blogroll</div>
    <div class="section">RSS feeds I follow.</div>
    <div class="section">
      ${entries.join("\n      ")}
    </div>
    <div class="section footnote">
      Generated from an <a href="/misc/feeds.opml">opml file</a> exported from Reeder.
    </div>
    <div class="nav-section">
      <span class="link nav-link" data-x="0" data-y="0">Home</span>
    </div>
  </div>
</div>`,
  );
}

/**
 * Generates the index with all available panels from the panels/ directory.
 */
async function buildIndex(filename: string, cssFilename: string) {
  console.log(`Building ${filename}`);

  const panels = [];
  for await (const panelFile of Deno.readDir(`${DIST_DIR}/panels`)) {
    const panelContent = await Deno.readTextFile(
      `${DIST_DIR}/panels/${panelFile.name}`,
    );
    panels.push(panelContent);
  }

  await Deno.writeTextFile(
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
    <link rel="icon" href="/images/favicon.png" />
    <link rel="apple-touch-icon" href="/images/apple-touch-icon.png" />
    <link type="text/css" rel="stylesheet" href="/${cssFilename}" />
    <link rel="preload" href="/fonts/ibmplexmono.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="/fonts/MarvinVisionsBig-Bold.woff2" as="font" type="font/woff2" crossorigin>
  </head>
  <body>
    <div id="panel-matrix" style="display: none">
      ${panels.sort().join("\n      ")}
    </div>
    <script type="module" src="/js/bootstrap.js"></script>
  </body>
</html>`,
  );
}

/** Builds CSS from SCSS. Returns the unique suffix used for the generated css. */
async function compileCss(): Promise<string> {
  const filename = `index-${genRandomString()}.css`;
  console.log(`Building ${DIST_DIR}/${filename}`);

  const result = await sass.compileAsync("./static/css/main.scss");
  await Deno.writeTextFile(`${DIST_DIR}/${filename}`, result.css);
  return filename;
}

function genRandomString() {
  return Math.random().toString(36).slice(2);
}
