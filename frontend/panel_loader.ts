import { DOMParser } from "jsr:@b-fuze/deno-dom";
import { renderPanel } from "./panel_renderer.ts";
import {
  getPanelLinks,
  Panel,
  PanelKey,
  toPanel,
  toPanelKey,
} from "../common/panel.ts";
import { filterToJournalPanels } from "./utils.ts";

export async function loadPanels(): Promise<Map<PanelKey, Panel>> {
  const panels = await fetchPanels();
  addJournalPanel(panels);
  await addBlogrollPanel(panels);
  addBacklinksToPanels(panels);
  addHrefsToLinks(panels);
  return panels;
}

async function fetchPanels() {
  const panels = new Map<PanelKey, Panel>();
  for await (const file of Deno.readDir("./panels")) {
    const panel = await renderPanel(file.name);
    if (!panel) {
      console.log(`Panel not found for ${file.name}`);
      continue;
    }
    panels.set(toPanelKey(panel.metadata.coordinates), panel);
  }
  return panels;
}

/** Generates the journal overview panel using the provided panels. */
function addJournalPanel(panels: Map<PanelKey, Panel>) {
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

async function addBlogrollPanel(panels: Map<PanelKey, Panel>) {
  const xmlContent = await Deno.readTextFile(`./public/misc/feeds.opml`);
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

function addPanel(panels: Map<PanelKey, Panel>, htmlContent: string) {
  const doc = new DOMParser().parseFromString(htmlContent, "text/html");
  const panelEl = doc.querySelector<HTMLElement>(".panel")!;
  const panel = toPanel(panelEl);
  panels.set(toPanelKey(panel.metadata.coordinates), panel);
}

function addBacklinksToPanels(panels: Map<PanelKey, Panel>) {
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
  panels: Map<PanelKey, Panel>,
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
  panels: Map<PanelKey, Panel>,
) {
  let result = "";
  for (const srcKey of srcKeys.values()) {
    const metadata = panels.get(srcKey)?.metadata;
    result +=
      `<a class="link backlink" data-x="${metadata?.coordinates.x}" data-y="${metadata?.coordinates.y}">${metadata?.title}</a>`;
  }
  return result;
}

function addHrefsToLinks(panels: Map<PanelKey, Panel>) {
  for (const panel of panels.values()) {
    const links = panel.el.querySelectorAll<HTMLElement>("a.link");
    for (const link of links) {
      link.setAttribute("href", `/!/${link.dataset.x}/${link.dataset.y}`);
    }
  }
}
