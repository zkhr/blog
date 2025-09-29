import { marked } from "npm:marked";
import matter from "npm:gray-matter";

interface PanelMetadata {
  title: string;
  coordinates: Coordinates;
  date?: string;
  type: PanelType;
  navLinks: NavLink[];
}

type PanelType = "blog" | "whoami" | "misc";

interface Coordinates {
  x: number;
  y: number;
}

interface NavLink {
  coordinates: Coordinates;
  label: string;
}

export function panelToHtml(panelText: string, filename: string) {
  const matterResponse = matter(panelText);
  const metadata = toPanelMetadata(matterResponse.data, filename);
  const html = marked.parse(matterResponse.content);
  return `<div
  class="panel ${metadata.type}-theme"
  data-x="${metadata.coordinates?.x}"
  data-y="${metadata.coordinates?.y}"
  data-type="${metadata.type}"
  data-url-suffix="${toUrlSuffix(metadata.title ?? "")}"
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
  const type = parseString(data.type, filename, "type") as PanelType;
  return {
    title: parseString(data.title, filename, "title"),
    coordinates: parseCoordinates(data.coordinates, filename),
    date: type === "blog" ? parseDate(data.date, filename) : undefined,
    type,
    navLinks: parseLinks(data.navLinks, filename),
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

function parseLinks(value: unknown, filename: string): NavLink[] {
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

function renderNavLink(navLink: NavLink) {
  return `<span class="link nav-link" data-x="${navLink.coordinates.x}" data-y="${navLink.coordinates.y}">${navLink.label}</span>`;
}
