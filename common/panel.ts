/** A rendered panel containing the associated DOM Element. */
export interface Panel {
  el: HTMLElement;
  metadata: PanelMetadata;
}

export interface PanelMetadata {
  coordinates: Coordinates;
  title: string;
  type: PanelType;
  urlSuffix: string;
  date?: string;
  navLinks: Link[];
}

export interface Coordinates {
  x: number;
  y: number;
}

export type PanelType = "blog" | "whoami" | "misc";

export interface Link {
  coordinates: Coordinates;
  label: string;
}

/** Uniquely identifies a panel. Useful for map lookups that require strings. */
export type PanelKey = string;

/** Converts an html element to a panel with its associated metadata. */
export function toPanel(el: HTMLElement): Panel {
  const metadata = {
    coordinates: getCoordinates(el),
    title: el.querySelector(".title")?.textContent ?? "",
    type: dataset(el, "type") as PanelType,
    urlSuffix: dataset(el, "urlSuffix"),
    date: el.querySelector(".blog-date")?.textContent ?? "",
    navLinks: getPanelLinks(el, ".nav-link"),
  };
  return { metadata, el };
}

/** Returns the dataset entry for an element. */
function dataset(el: HTMLElement, entry: string): string {
  if (el.dataset) return el.dataset[entry] ?? "";

  // The node dom-parser library only populates attributes, not dataset, so
  // we have to find it manually...
  for (const attr of el.attributes) {
    if (attr.name === `data-${entry}`) {
      return attr.value;
    }
  }
  return "";
}

function getCoordinates(el: HTMLElement): Coordinates {
  return {
    x: parseInt(dataset(el, "x")) || 0,
    y: parseInt(dataset(el, "y")) || 0,
  };
}

export function getPanelLinks(el: HTMLElement, selector: string): Link[] {
  return [...el.querySelectorAll<HTMLElement>(selector)]
    .map(
      (linkEl) => ({
        label: linkEl.textContent ?? "",
        coordinates: getCoordinates(linkEl),
      }),
    );
}

export function toPanelKey(coordinates: Coordinates): PanelKey {
  return `(${coordinates.x},${coordinates.y})`;
}
