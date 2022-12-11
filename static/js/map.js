/** The size of a panel in the minimap in pixels. */
const PANEL_SIZE = 25;

class Map {
  /** The map element on the page. */
  #mapEl;

  /** The slider that changes offset as the user moves around. */
  #sliderEl;

  /** Provides information about the site grid. */
  #matrix;

  constructor(matrix) {
    this.#matrix = matrix;
    this.#mapEl = null;
  }

  render() {
    this.#buildMap();
    this.#updateSlider();

    // Clicking the map will hide/show it. Defauls hidden.
    this.#mapEl.addEventListener("click", (evt) => {
      this.#mapEl.classList.toggle("visible");
    });

    // Navigating around the grid will trigger updates for the map.
    window.addEventListener("coordinatechange", () => this.#updateSlider());
  }

  #buildMap() {
    this.#mapEl = document.createElement("div");
    this.#mapEl.classList.add("map");

    const homeMarker = document.createElement("div");
    homeMarker.classList.add("map-home");
    this.#mapEl.appendChild(homeMarker);

    document.createElement("div");
    this.#mapEl.classList.add("map");

    this.#sliderEl = document.createElement("div");
    this.#sliderEl.classList.add("map-slider");
    this.#mapEl.appendChild(this.#sliderEl);

    for (const panel of this.#matrix.listPanels()) {
      const panelEl = document.createElement("div");
      panelEl.classList.add("map-panel", `${panel.type}-theme`);
      panelEl.style.left = `${PANEL_SIZE * panel.x}px`;
      panelEl.style.top = `${-1 * PANEL_SIZE * panel.y}px`;
      this.#sliderEl.appendChild(panelEl);
    }

    document.body.appendChild(this.#mapEl);
  }

  #updateSlider() {
    const coords = this.#matrix.getCurrentCoordinates();
    this.#sliderEl.style.left = `${75 - PANEL_SIZE * coords.x}px`;
    this.#sliderEl.style.top = `${75 + PANEL_SIZE * coords.y}px`;
  }
}

export { Map };
