import { DOMParser } from "jsr:@b-fuze/deno-dom";
import * as sass from "npm:sass-embedded";
import { bundle } from "jsr:@deno/emit";
import { panelToHtml } from "./panels.ts";
import {
  getPanelLinks,
  PanelKey,
  RenderedPanel,
  toPanelKey,
  toRenderedPanel,
} from "./common/rendered_panel.ts";

/** The destination directory, which can be served to render the frontend. */
const DIST_DIR = "./dist";

try {
  await Deno.remove(DIST_DIR, { recursive: true });
} catch (_) {
  // If we couldn't remove the directory, it probably didn't exist yet.
}
await Deno.mkdir(`${DIST_DIR}/`, { recursive: true });

// Setup panels
const panels = await loadPanels();
addJournalPanel(panels);
await addBlogrollPanel(panels);
addBacklinksToPanels(panels);
addHrefsToLinks(panels);

// Setup index
const cssFilename = await compileCss();
const jsFilename = await compileJs();
await buildIndex(
  [...panels.values()],
  `${DIST_DIR}/index.html`,
  jsFilename,
  cssFilename,
);

// Setup supplemental files
await copyStaticContentToDist();
await buildAtomFeed(panels, `${DIST_DIR}/rss`);
await buildFileNotFoundPage(`${DIST_DIR}/404.html`);

/** Copies all static content to the dist/ directory. */
async function copyStaticContentToDist() {
  const staticDirs = ["fonts", "images", "misc"];
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

async function loadPanels() {
  const panels = new Map<PanelKey, RenderedPanel>();
  for await (const file of Deno.readDir("./panels")) {
    const src = `./panels/${file.name}`;
    const suffix = file.name.split(".")[1];
    const htmlContent = await getPanelHtml(suffix, src, file.name);
    const doc = new DOMParser().parseFromString(htmlContent, "text/html");
    const panelEl = doc.querySelector<HTMLElement>(".panel");
    if (!panelEl) {
      console.log(`Panel not found for ${file.name}`);
      continue;
    }
    const panel = toRenderedPanel(panelEl);
    panels.set(toPanelKey(panel.metadata.coordinates), panel);
  }
  return panels;
}

async function getPanelHtml(suffix: string, src: string, filename: string) {
  switch (suffix) {
    case "html": {
      return Deno.readTextFile(src);
    }
    case "md": {
      const panelText = await Deno.readTextFile(src);
      return panelToHtml(panelText, filename);
    }
  }
  return "";
}

function addBacklinksToPanels(panels: Map<PanelKey, RenderedPanel>) {
  const backlinkMap = buildBacklinks(panels);
  for (const [destKey, srcKeys] of backlinkMap) {
    const panel = panels.get(destKey);
    if (!panel) {
      console.log(`No panel found with key: ${destKey}`);
      continue;
    }
    const contentEl = panel.el.querySelector<HTMLElement>(".panel-content");
    if (!contentEl) {
      console.log(`Error building backlink for ${panel.metadata.title}.`);
      continue;
    }
    const doc = new DOMParser().parseFromString(
      `<div class="backlinks">
        <div class="backlinks-title">⇐ Backlinks:</div>
        <div class="backlinks-content">
          ${renderBacklinks(srcKeys, panels)}
        </div>
      </div>`,
      "text/html",
    );
    contentEl.appendChild(doc.querySelector<HTMLElement>(".backlinks")!);
  }
}

function buildBacklinks(
  panels: Map<PanelKey, RenderedPanel>,
): Map<PanelKey, Set<PanelKey>> {
  const backlinkMap = new Map<PanelKey, Set<PanelKey>>();
  for (const [srcKey, panel] of panels.entries()) {
    const links = getPanelLinks(
      panel.el,
      ".link:not(.nav-link):not(.journal-link)",
    );
    for (const link of links) {
      const destKey = toPanelKey(link.coordinates);
      let destBackLinks = backlinkMap.get(destKey);
      if (!destBackLinks) {
        destBackLinks = new Set<PanelKey>();
        backlinkMap.set(destKey, destBackLinks);
      }
      destBackLinks.add(srcKey);
    }
  }
  return backlinkMap;
}

function renderBacklinks(
  srcKeys: Set<PanelKey>,
  panels: Map<PanelKey, RenderedPanel>,
) {
  let result = "";
  for (const srcKey of srcKeys.values()) {
    const metadata = panels.get(srcKey)?.metadata;
    result +=
      `<a class="link backlink" data-x="${metadata?.coordinates.x}" data-y="${metadata?.coordinates.y}">${metadata?.title}</a>`;
  }
  return result;
}

function addHrefsToLinks(panels: Map<PanelKey, RenderedPanel>) {
  for (const panel of panels.values()) {
    const links = panel.el.querySelectorAll<HTMLElement>("a.link");
    for (const link of links) {
      link.setAttribute("href", `/!/${link.dataset.x}/${link.dataset.y}`);
    }
  }
}

/** Filters the provided panels to just journal panels, sorted chronologically. */
function filterToJournalPanels(
  panels: Map<PanelKey, RenderedPanel>,
): RenderedPanel[] {
  return [...panels.values()]
    .filter((panel) => panel.metadata.type === "blog")
    .sort((a, b) => b.metadata.date!.localeCompare(a.metadata.date!));
}

/** Generates the journal overview panel using the provided panels. */
function addJournalPanel(
  panels: Map<PanelKey, RenderedPanel>,
) {
  const blogEntries = [];
  for (const panel of filterToJournalPanels(panels)) {
    const metadata = panel.metadata;
    blogEntries.push(
      `<div class="blog-entry">
        <div class="blog-entry-date">${metadata.date} -</div>
        <a class="link journal-link" data-x="${metadata.coordinates.x}" data-y="${metadata.coordinates.y}">${metadata.title}</a>
      </div>`,
    );
  }

  addPanel(
    panels,
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
      <a class="link nav-link" data-x="0" data-y="0">Home</a>
    </div>
  </div>
</div>`,
  );
}

/** Generates the atom feed using the provided panels. */
async function buildAtomFeed(
  panels: Map<PanelKey, RenderedPanel>,
  filename: string,
) {
  console.log(`Building ${filename}`);
  const entries = [];
  let count = 0;
  for (const panel of filterToJournalPanels(panels)) {
    let content = [...panel.el.querySelectorAll("p, h1, .section")]
      .map((x) => x.textContent?.replace(/\s+/g, " ").trim())
      .join("</p><p>");
    content = `<p>${content}</p>`
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    const metadata = panel.metadata;
    const url =
      `https://ari.blumenthal.dev/!/${metadata.coordinates.x}/${metadata.coordinates.y}/${metadata.urlSuffix}`;

    entries.push(
      `<entry>
    <title>${metadata.title}</title>
    <link href="${url}"/>
    <id>${url}</id>
    <updated>${metadata.date}T12:34:56Z</updated>
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

async function addBlogrollPanel(panels: Map<PanelKey, RenderedPanel>) {
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

  addPanel(
    panels,
    `<div
  class="panel whoami-theme"
  data-x="-1"
  data-y="1"
  data-type="whoami"
  data-url-suffix="blogroll"
>
  <div class="panel-content">
    <div class="title">Blogroll.</div>
    <div class="section">RSS feeds I follow.</div>
    <div class="section">
      ${entries.join("\n      ")}
    </div>
    <div class="section footnote">
      Generated from an <a href="/misc/feeds.opml">opml file</a> exported from Reeder.
    </div>
    <div class="nav-section">
      <a class="link nav-link" data-x="0" data-y="0">Home</a>
    </div>
  </div>
</div>`,
  );
}

function addPanel(panels: Map<PanelKey, RenderedPanel>, htmlContent: string) {
  const doc = new DOMParser().parseFromString(htmlContent, "text/html");
  const panelEl = doc.querySelector<HTMLElement>(".panel")!;
  const panel = toRenderedPanel(panelEl);
  panels.set(toPanelKey(panel.metadata.coordinates), panel);
}

/**
 * Generates the index with all available panels from the panels/ directory.
 */
async function buildIndex(
  panels: RenderedPanel[],
  filename: string,
  jsFilename: string,
  cssFilename: string,
) {
  console.log(`Building ${filename}`);

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
      ${panels.map((p) => p.el.outerHTML).join("\n      ")}
    </div>
    <script src="/${jsFilename}"></script>
  </body>
</html>`,
  );
}

/** Generates a 404 page. */
async function buildFileNotFoundPage(filename: string) {
  console.log(`Building ${filename}`);

  await Deno.writeTextFile(
    filename,
    `<!DOCTYPE HTML><head><title>404</title></head>`,
  );
}

/** Builds CSS from SCSS. Returns the filename of the generated css. */
async function compileCss(): Promise<string> {
  const filename = `index-${genRandomString()}.css`;
  console.log(`Building ${DIST_DIR}/${filename}`);

  const result = await sass.compileAsync("./static/css/main.scss");
  await Deno.writeTextFile(`${DIST_DIR}/${filename}`, result.css);
  return filename;
}

/** Builds JS from TS sources. Returns the filename of the generated js. */
async function compileJs(): Promise<string> {
  const filename = `index-${genRandomString()}.js`;
  console.log(`Building ${DIST_DIR}/${filename}`);

  const result = await bundle("src/app.ts");
  await Deno.writeTextFile(`${DIST_DIR}/${filename}`, result.code);
  return filename;
}

function genRandomString() {
  return Math.random().toString(36).slice(2);
}
