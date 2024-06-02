class Loader {
  /** Provides information about the site grid. */
  #matrix;

  #loaded = new Set();

  constructor(matrix) {
    this.#matrix = matrix;
  }

  init() {
    this.#handleLoad();

    // Navigating around the grid may trigger additional js to load.
    window.addEventListener("coordinatechange", () => this.#handleLoad());
  }

  #handleLoad() {
    const metadata = this.#matrix.getCurrentMetadata();
    if (!metadata || !metadata.js || this.#loaded.has(metadata.js)) {
      return;
    }

    import(`/static/js/${metadata.js}.js`).then((module) =>
      module.loadModule()
    );
    this.#loaded.add(metadata.js);
  }
}

export { Loader };
