export interface Coordinates {
  x: number;
  y: number;
}

export type PanelType = "blog" | "whoami" | "misc";

export interface PanelMetadata {
  coordinates: Coordinates;
  title: string;
  type: PanelType;
  urlSuffix: string;
  date?: string;
  navLinks: Link[];
}

export interface Link {
  coordinates: Coordinates;
  label: string;
}

/** A rendered panel containing the associated DOM Element. */
export interface RenderedPanel {
  el: HTMLElement;
  metadata: PanelMetadata;
}

/** Uniquely identifies a panel. Useful for map lookups that require strings. */
export type PanelKey = string;

/** Converts an html element to a panel with its associated metadata. */
export function toRenderedPanel(el: HTMLElement): RenderedPanel {
  const metadata = {
    coordinates: getCoordinates(el),
    title: el.querySelector(".title")?.textContent ?? "",
    type: (el.dataset.type ?? "") as PanelType,
    urlSuffix: el.dataset.urlSuffix ?? "",
    date: el.querySelector(".blog-date")?.textContent ?? "",
    navLinks: getPanelLinks(el, ".nav-link"),
  };
  return { metadata, el };
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

function getCoordinates(el: HTMLElement): Coordinates {
  return {
    x: parseInt(el.dataset.x ?? "0"),
    y: parseInt(el.dataset.y ?? "0"),
  };
}

export function toPanelKey(coordinates: Coordinates): PanelKey {
  return `(${coordinates.x},${coordinates.y})`;
}
