import { JSDOM } from "jsdom";
import { marked } from "marked";
import matter from "gray-matter";
import {
  type Coordinates,
  type Link,
  type Panel,
  type PanelMetadata,
  type PanelType,
  toPanel,
} from "../common/panel.ts";
import { readFile } from "node:fs/promises";

export async function renderPanel(filename: string): Promise<Panel | null> {
  const src = `./panels/${filename}`;
  const suffix = filename.split(".")[1];
  const htmlContent = await getPanelHtml(suffix, src, filename);
  const dom = new JSDOM(htmlContent);
  const panels = dom.window.document.getElementsByClassName("panel");
  return panels.length > 0 ? toPanel(panels[0]) : null;
}

async function getPanelHtml(suffix: string, src: string, filename: string) {
  switch (suffix) {
    case "html": {
      return readFile(src, { encoding: "utf8" });
    }
    case "md": {
      const panelText = await readFile(src, { encoding: "utf8" });
      return mdToHtml(panelText, filename);
    }
  }
  return "";
}

function mdToHtml(panelText: string, filename: string) {
  const matterResponse = matter(panelText);
  const metadata = toPanelMetadata(matterResponse.data, filename);
  const html = marked.parse(matterResponse.content);
  return `<div
  class="panel ${metadata.type}-theme"
  data-x="${metadata.coordinates?.x}"
  data-y="${metadata.coordinates?.y}"
  data-type="${metadata.type}"
  data-url-suffix="${metadata.urlSuffix}"
>
  <div class="panel-content">
    <div class="title">${metadata.title ?? ""}.</div>
    ${metadata.date ? `<div class="blog-date">${metadata.date}</div>` : ""}
    ${html}    <div class="nav-section">
      ${metadata.navLinks.map((l) => renderNavLink(l)).join("\n      ")}
    </div>
  </div>
</div>
  `;
}

function toPanelMetadata(
  data: { [key: string]: unknown },
  filename: string,
): PanelMetadata {
  const title = parseString(data.title, filename, "title");
  const type = parseString(data.type, filename, "type") as PanelType;
  return {
    title,
    type,
    coordinates: parseCoordinates(data.coordinates, filename),
    date: type === "blog" ? parseDate(data.date, filename) : undefined,
    navLinks: parseLinks(data.navLinks, filename),
    urlSuffix: toUrlSuffix(title),
  };
}

function parseString(value: unknown, filename: string, key: string): string {
  if (!value) {
    console.log(`Error parsing ${filename}. Missing ${key}.`);
    return "";
  } else if (typeof value !== "string") {
    console.log(`Error parsing ${filename}. Invalid ${key}: [${value}].`);
    return "";
  }
  return value;
}

function parseDate(value: unknown, filename: string): string {
  if (!value) {
    console.log(`Error parsing ${filename}. Missing date.`);
    return "";
  } else if (!(value instanceof Date)) {
    console.log(`Error parsing ${filename}. Invalid date: [${value}].`);
    return "";
  }
  return value.toISOString().slice(0, 10);
}

function parseCoordinates(value: unknown, filename: string): Coordinates {
  if (!value) {
    console.log(`Error parsing ${filename}. Missing coordinates.`);
    return { x: 0, y: 0 };
  } else if (typeof value !== "string") {
    console.log(`Error parsing ${filename}. Invalid coordinates: [${value}].`);
    return { x: 0, y: 0 };
  }
  const [x, y] = value.split(" ");
  return { x: parseInt(x), y: parseInt(y) };
}

function parseLinks(value: unknown, filename: string): Link[] {
  if (!value) {
    console.log(`Error parsing ${filename}. Missing links.`);
    return [];
  } else if (!Array.isArray(value)) {
    console.log(`Error parsing ${filename}. Invalid links: [${value}].`);
    return [];
  }
  const links = [];
  for (const entry of value) {
    if (typeof entry !== "string") {
      continue;
    }
    const [x, y, label] = entry.split(" ");
    links.push({
      coordinates: { x: parseInt(x), y: parseInt(y) },
      label,
    });
  }
  return links;
}

function toUrlSuffix(title: string) {
  return title.replaceAll(",", "").replaceAll(":", "").replaceAll(" ", "-");
}

function renderNavLink(navLink: Link) {
  return `<a class="link nav-link" data-x="${navLink.coordinates.x}" data-y="${navLink.coordinates.y}">${navLink.label}</a>`;
}
