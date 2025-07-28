/**
 * The default matrix coordinates to use when no valid ones are provided in the
 * URL.
 */
const DEFAULT_COORDINATES = { x: 0, y: 0 };

const ZOOM_FACTORS = [1, 0.5, 0.25];

class Matrix {
  /** The main matrix element on the page. */
  #panelMatrixEl;

  /** A map from coordinates to metadata about a panel. */
  #panelMetadataMap;

  /** Tracks the coordinates of the currently rendered panel. */
  #currentCoord;

  /** The current zoom level. */
  #zoomLevel;

  constructor() {
    this.#panelMatrixEl = document.getElementById("panel-matrix");
    this.#panelMetadataMap = this.#loadPanels();
    this.#currentCoord = this.#getStartingCoordinates();
    this.#zoomLevel = 0;
  }

  render() {
    this.#initMatrixLinks();
    this.#initTouchscreenNavigation();

    this.goToCoordinate(this.#currentCoord.x, this.#currentCoord.y);
    this.#panelMatrixEl.style.display = "";

    return this;
  }

  /**
   * Returns metadata for all panels in the grid, in no particular order.
   */
  listPanels() {
    return [...this.#panelMetadataMap.values()];
  }

  /** Returns the current coordinates. */
  getCurrentCoordinates() {
    return this.#currentCoord;
  }

  /** Returns the metadata for the current coordinates. */
  getCurrentMetadata() {
    const { x, y } = this.#currentCoord;
    return this.#panelMetadataMap.get(this.#getPanelMetadataMapKey(x, y));
  }

  /**
   * Builds a map from coordinates to metadata about the panel at the
   * coordinate.
   */
  #loadPanels() {
    const panelEls = document.getElementsByClassName("panel");
    const results = new Map();
    for (const panelEl of panelEls) {
      const x = parseInt(panelEl.dataset.x);
      const y = parseInt(panelEl.dataset.y);

      // Set the coordinates for the panel in the grid.
      panelEl.style.left = `${100 * x}vw`;
      panelEl.style.top = `${-100 * y}vh`;

      // Track panel metadata for user later in code.
      results.set(this.#getPanelMetadataMapKey(x, y), {
        x,
        y,
        type: panelEl.dataset.type,
        urlSuffix: panelEl.dataset.urlSuffix,
        js: panelEl.dataset.js,
      });
    }
    return results;
  }

  #getPanelMetadataMapKey(x, y) {
    return `(${x},${y})`;
  }

  /** Initializes all links for the panel matrix. */
  #initMatrixLinks() {
    const linkEls = document.querySelectorAll(".link");
    for (const linkEl of linkEls) {
      linkEl.addEventListener("click", (evt) => {
        const newX = parseInt(evt.target.dataset.x);
        const newY = parseInt(evt.target.dataset.y);
        this.goToCoordinate(newX, newY);
      });
    }
  }

  /** Initializes touchscreen navigation. */
  #initTouchscreenNavigation() {
    let startCoord = null;
    document.addEventListener("touchstart", (evt) => {
      const panel = evt.target.closest(".panel");
      startCoord = {
        x: evt.touches[0].clientX,
        y: evt.touches[0].clientY,
        atTop: !panel || panel.scrollTop === 0,
        atBottom:
          !panel ||
          panel.scrollHeight <= Math.ceil(panel.scrollTop + panel.clientHeight),
      };
    });
    document.addEventListener("touchmove", (evt) => {
      if (startCoord == null || evt.touches.length > 1) {
        return;
      }

      const selectedText = window.getSelection().toString();
      if (selectedText != "") {
        // User has selected text, don't swipe the panels.
        return;
      }

      const xDelta = startCoord.x - evt.touches[0].clientX;
      const yDelta = startCoord.y - evt.touches[0].clientY;
      if (Math.abs(xDelta) > Math.abs(yDelta) && Math.abs(xDelta) > 50) {
        xDelta > 0 ? this.goRight() : this.goLeft();
        startCoord = null;
      } else if (Math.abs(yDelta) > 50) {
        if (yDelta > 0 && startCoord.atBottom) {
          this.goDown();
          startCoord = null;
        } else if (yDelta < 0 && startCoord.atTop) {
          this.goUp();
          startCoord = null;
        }
      }
    });
  }

  /** Navigates to the panel to the left of the current panel. */
  goLeft() {
    this.goToCoordinate(this.#currentCoord.x - 1, this.#currentCoord.y);
  }

  /** Navigates to the panel to the right of the current panel. */
  goRight() {
    this.goToCoordinate(this.#currentCoord.x + 1, this.#currentCoord.y);
  }

  /** Navigates to the panel above the current panel. */
  goUp() {
    this.goToCoordinate(this.#currentCoord.x, this.#currentCoord.y + 1);
  }

  /** Navigates to the panel below the current panel. */
  goDown() {
    this.goToCoordinate(this.#currentCoord.x, this.#currentCoord.y - 1);
  }

  /** Zooms out of the panel. */
  zoomOut() {
    if (this.#zoomLevel < ZOOM_FACTORS.length - 1) {
      this.#zoomLevel += 1;
      const { x, y } = this.#currentCoord;
      this.goToCoordinate(x, y);
    }
  }

  /** Zooms in to the panel. */
  zoomIn() {
    if (this.#zoomLevel > 0) {
      this.#zoomLevel -= 1;
      const { x, y } = this.#currentCoord;
      this.goToCoordinate(x, y);
    }
  }

  /** Navigates the page to the provided coordinates. */
  goToCoordinate(x, y) {
    const offset = 100 * ZOOM_FACTORS[this.#zoomLevel];
    const translate = `translate(${-1 * offset * x}vw, ${offset * y}vh)`;
    const scale = `scale(${ZOOM_FACTORS[this.#zoomLevel]})`;
    this.#panelMatrixEl.style.transform = `${translate} ${scale}`;
    this.#currentCoord = { x, y };
    const path = this.#getCoordinatePath(x, y);
    window.history.replaceState(null, "", path);
    window.dispatchEvent(new Event("coordinatechange"));
  }

  /** Returns the path to use in the URL for the provided coordinates. */
  #getCoordinatePath(x, y) {
    const metadata = this.#panelMetadataMap.get(
      this.#getPanelMetadataMapKey(x, y)
    );
    let path = `/!/${x}/${y}`;
    if (metadata && metadata.urlSuffix) {
      path += `/${metadata.urlSuffix}`;
    }
    return path;
  }

  /** Returns the starting coordinates based on the curent url. */
  #getStartingCoordinates() {
    const results = /\!\/([-\d]+)\/([-\d]+)/.exec(window.location.href);
    if (!results) {
      return DEFAULT_COORDINATES;
    }

    const x = parseInt(results[1]);
    const y = parseInt(results[2]);
    if (!Number.isInteger(x) || !Number.isInteger(y)) {
      return DEFAULT_COORDINATES;
    }

    return { x, y };
  }
}

export { Matrix };
