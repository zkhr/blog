/** The size of a panel in the minimap in pixels. */
const PANEL_SIZE = 25;

class Minimap {
  /** The minimap element on the page. */
  #minimapEl;

  /** The slider that changes offset as the user moves around. */
  #sliderEl;

  /** Provides information about the site grid. */
  #matrix;

  constructor(matrix) {
    this.#matrix = matrix;
    this.#minimapEl = null;
  }

  render() {
    this.#buildMinimap();
    this.#updateSlider();

    // Clicking the minimap will hide/show it.
    this.#minimapEl.addEventListener("click", (evt) => {
      this.#minimapEl.classList.toggle("visible");
    });

    // Navigating around the grid will trigger updates for the minimap.
    window.addEventListener("coordinatechange", () => this.#updateSlider());
  }

  #buildMinimap() {
    this.#minimapEl = document.createElement("div");
    this.#minimapEl.classList.add("map");
    if (window.innerWidth > 1000) {
      // Default visible on desktop, when content won't overlap.
      this.#minimapEl.classList.add("visible");
    }

    const homeMarker = document.createElement("div");
    homeMarker.classList.add("map-home");
    this.#minimapEl.appendChild(homeMarker);

    this.#sliderEl = document.createElement("div");
    this.#sliderEl.classList.add("map-slider");
    this.#minimapEl.appendChild(this.#sliderEl);

    for (const panel of this.#matrix.listPanels()) {
      const panelEl = document.createElement("div");
      panelEl.classList.add("map-panel", `${panel.type}-theme`);
      panelEl.style.left = `${PANEL_SIZE * panel.x}px`;
      panelEl.style.top = `${-1 * PANEL_SIZE * panel.y}px`;
      this.#sliderEl.appendChild(panelEl);
    }

    document.body.appendChild(this.#minimapEl);
  }

  #updateSlider() {
    const coords = this.#matrix.getCurrentCoordinates();
    this.#sliderEl.style.left = `${75 - PANEL_SIZE * coords.x}px`;
    this.#sliderEl.style.top = `${75 + PANEL_SIZE * coords.y}px`;
  }
}

export { Minimap };
