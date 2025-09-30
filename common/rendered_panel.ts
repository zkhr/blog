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
  navLinks: NavLink[];
}

export interface NavLink {
  coordinates: Coordinates;
  label: string;
}

/** A rendered panel containing the associated DOM Element. */
export interface RenderedPanel {
  el: HTMLElement;
  metadata: PanelMetadata;
}

/** Converts an html element to a panel with its associated metadata. */
export function toRenderedPanel(el: HTMLElement): RenderedPanel {
  const metadata = {
    coordinates: getCoordinates(el),
    title: el.querySelector(".title")?.textContent ?? "",
    type: (el.dataset.type ?? "") as PanelType,
    urlSuffix: el.dataset.urlSuffix ?? "",
    date: el.querySelector(".blog-date")?.textContent ?? "",
    navLinks: getNavLinks(el),
  };
  return { metadata, el };
}

function getNavLinks(el: HTMLElement): NavLink[] {
  return [...el.querySelectorAll<HTMLElement>(".nav-link")]
    .map(
      (navLinkEl) => ({
        label: navLinkEl.textContent ?? "",
        coordinates: getCoordinates(navLinkEl),
      }),
    );
}

function getCoordinates(el: HTMLElement): Coordinates {
  return {
    x: parseInt(el.dataset.x ?? "0"),
    y: parseInt(el.dataset.y ?? "0"),
  };
}
