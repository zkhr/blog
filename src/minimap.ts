import Matrix from "./matrix.ts";

/** The size of a panel in the minimap in pixels. */
const PANEL_SIZE = 25;

export default class Minimap {
  /** The minimap element on the page. */
  private minimapEl: HTMLElement;

  /** The slider that changes offset as the user moves around. */
  private sliderEl: HTMLElement;

  /** Provides information about the site grid. */
  private matrix: Matrix;

  constructor(matrix: Matrix) {
    this.matrix = matrix;
    this.minimapEl = null;
  }

  render() {
    this.buildMinimap();
    this.updateSlider();

    // Clicking the minimap will hide/show it.
    this.minimapEl.addEventListener("click", () => {
      this.minimapEl.classList.toggle("visible");
    });

    // Navigating around the grid will trigger updates for the minimap.
    addEventListener("coordinatechange", () => this.updateSlider());
  }

  private buildMinimap() {
    this.minimapEl = document.createElement("div");
    this.minimapEl.classList.add("map");
    if (innerWidth > 1000) {
      // Default visible on desktop, when content won't overlap.
      this.minimapEl.classList.add("visible");
    }

    const homeMarker = document.createElement("div");
    homeMarker.classList.add("map-home");
    this.minimapEl.appendChild(homeMarker);

    this.sliderEl = document.createElement("div");
    this.sliderEl.classList.add("map-slider");
    this.minimapEl.appendChild(this.sliderEl);

    for (const panel of this.matrix.listPanels()) {
      const panelEl = document.createElement("div");
      panelEl.classList.add("map-panel", `${panel.type}-minimap-bg`);
      panelEl.style.left = `${PANEL_SIZE * panel.x}px`;
      panelEl.style.top = `${-1 * PANEL_SIZE * panel.y}px`;
      this.sliderEl.appendChild(panelEl);
    }

    document.body.appendChild(this.minimapEl);
  }

  private updateSlider() {
    const coords = this.matrix.getCurrentCoordinates();
    this.sliderEl.style.left = `${75 - PANEL_SIZE * coords.x}px`;
    this.sliderEl.style.top = `${75 + PANEL_SIZE * coords.y}px`;
  }
}
