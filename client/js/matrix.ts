import {
  Coordinates,
  Panel,
  PanelKey,
  toPanel,
  toPanelKey,
} from "../../common/panel.ts";

/**
 * The default matrix coordinates to use when no valid ones are provided in the
 * URL.
 */
const DEFAULT_COORDINATES: Coordinates = { x: 0, y: 0 };

const ZOOM_FACTORS = [1, 0.5, 0.25];

interface TouchMetadata {
  x: number;
  y: number;
  atTop: boolean;
  atBottom: boolean;
}

export default class Matrix {
  /** The main matrix element on the page. */
  private panelMatrixEl: HTMLElement;

  /** A map from coordinates to the rendered panel. */
  private panelMap: Map<PanelKey, Panel>;

  /** Tracks the coordinates of the currently rendered panel. */
  private currentCoord: Coordinates;

  /** The current zoom level. */
  private zoomLevel: number;

  /** The current pending callback to clear panels. */
  private deletePanelsTimeout: number | null;

  constructor(panels: string[]) {
    this.panelMatrixEl = document.getElementById("panel-matrix")!;
    this.panelMap = this.loadPanels(panels);
    this.currentCoord = this.getStartingCoordinates();
    this.zoomLevel = 0;
    this.deletePanelsTimeout = null;
  }

  render() {
    this.initTouchscreenNavigation();

    this.goToCoordinate(this.currentCoord.x, this.currentCoord.y);
    this.panelMatrixEl.style.display = "";

    return this;
  }

  /**
   * Returns all panels in the grid, in no particular order.
   */
  listPanels(): Panel[] {
    return [...this.panelMap.values()];
  }

  /** Returns the current coordinates. */
  getCurrentCoordinates() {
    return this.currentCoord;
  }

  /** Returns the metadata for the current coordinates. */
  getCurrentMetadata(): Panel | undefined {
    return this.panelMap.get(toPanelKey(this.currentCoord));
  }

  /**
   * Builds a map from coordinates to metadata about the panel at the
   * coordinate.
   */
  loadPanels(panels: string[]) {
    const parser = new DOMParser();
    const results = new Map();
    for (const panelStr of panels) {
      const doc = parser.parseFromString(panelStr, "text/html");
      const panelEl = doc.querySelector<HTMLElement>(".panel");
      if (!panelEl) {
        continue;
      }
      const x = parseInt(panelEl.dataset.x ?? "0");
      const y = parseInt(panelEl.dataset.y ?? "0");
      const coordinates = { x, y };

      // Set the coordinates for the panel in the grid.
      panelEl.style.left = `${100 * x}vw`;
      panelEl.style.top = `${-100 * y}vh`;

      // Track panel information for use later in code.
      results.set(toPanelKey(coordinates), toPanel(panelEl));

      this.initMatrixLinks(panelEl);
      panelEl.remove();
    }
    return results;
  }

  /** Initializes all links for the provided panel. */
  initMatrixLinks(panelEl: HTMLElement) {
    const linkEls = panelEl.querySelectorAll(".link");
    for (const linkEl of linkEls) {
      linkEl.addEventListener("click", (e) => {
        e.preventDefault();
        const target = e.target as HTMLElement;
        const newX = parseInt(target.dataset.x ?? "0");
        const newY = parseInt(target.dataset.y ?? "0");
        this.goToCoordinate(newX, newY);
      });
    }
  }

  /** Initializes touchscreen navigation. */
  initTouchscreenNavigation() {
    let startCoord: TouchMetadata | null = null;
    document.addEventListener("touchstart", (e) => {
      const target = e.target as HTMLElement;
      const panel = target.closest(".panel");
      startCoord = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        atTop: !panel || panel.scrollTop === 0,
        atBottom: !panel ||
          panel.scrollHeight <= Math.ceil(panel.scrollTop + panel.clientHeight),
      };
    });
    document.addEventListener("touchmove", (e) => {
      if (startCoord == null || e.touches.length > 1) {
        return;
      }

      const selectedText = getSelection()?.toString();
      if (selectedText != "") {
        // User has selected text, don't swipe the panels.
        return;
      }

      const xDelta = startCoord.x - e.touches[0].clientX;
      const yDelta = startCoord.y - e.touches[0].clientY;
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
    this.goToCoordinate(this.currentCoord.x - 1, this.currentCoord.y);
  }

  /** Navigates to the panel to the right of the current panel. */
  goRight() {
    this.goToCoordinate(this.currentCoord.x + 1, this.currentCoord.y);
  }

  /** Navigates to the panel above the current panel. */
  goUp() {
    this.goToCoordinate(this.currentCoord.x, this.currentCoord.y + 1);
  }

  /** Navigates to the panel below the current panel. */
  goDown() {
    this.goToCoordinate(this.currentCoord.x, this.currentCoord.y - 1);
  }

  /** Zooms out of the panel. */
  zoomOut() {
    if (this.zoomLevel < ZOOM_FACTORS.length - 1) {
      this.zoomLevel += 1;
      const { x, y } = this.currentCoord;
      this.goToCoordinate(x, y);
    }
  }

  /** Zooms in to the panel. */
  zoomIn() {
    if (this.zoomLevel > 0) {
      this.zoomLevel -= 1;
      const { x, y } = this.currentCoord;
      this.goToCoordinate(x, y);
    }
  }

  /** Navigates the page to the provided coordinates. */
  goToCoordinate(x: number, y: number) {
    this.updatePanelVisibility(x, y);
    const offset = 100 * ZOOM_FACTORS[this.zoomLevel];
    const translate = `translate(${-1 * offset * x}vw, ${offset * y}vh)`;
    const scale = `scale(${ZOOM_FACTORS[this.zoomLevel]})`;
    this.panelMatrixEl.style.transform = `${translate} ${scale}`;
    this.currentCoord = { x, y };
    const path = this.getCoordinatePath(this.currentCoord);
    history.replaceState(null, "", path);
    dispatchEvent(new Event("coordinatechange"));
  }

  /**
   * Updates the panels rendered in the dom. Note that we originally rendered
   * *all* panels, but as the blog grew, this started to crash certain browsers
   * (*cough* mobile safari). So instead, we just render the panels needed to
   * show everything on the page at the current zoom level.
   */
  updatePanelVisibility(x: number, y: number) {
    // Add any panels the user will see.
    const zl = this.zoomLevel;
    for (let i = x - zl; i <= x + zl; i++) {
      for (let j = y - zl; j <= y + zl; j++) {
        const panel = this.panelMap.get(toPanelKey({ x: i, y: j }));
        if (panel && panel.el.parentNode === null) {
          this.panelMatrixEl.append(panel.el);
        }
      }
    }

    // And schedule to delete panels that are no longer visible.
    if (this.deletePanelsTimeout) {
      // But first, clear any existing timeouts so that we don't hide any
      // panels too early in the animation.
      clearTimeout(this.deletePanelsTimeout);
      this.deletePanelsTimeout = null;
    }
    this.deletePanelsTimeout = setTimeout(() => {
      const curr = this.currentCoord;
      const z = this.zoomLevel;
      const panelEls = document.querySelectorAll<HTMLElement>(".panel");
      for (const panelEl of panelEls) {
        const x1 = parseInt(panelEl.dataset.x ?? "0");
        const y1 = parseInt(panelEl.dataset.y ?? "0");
        if (Math.abs(curr.x - x1) > z || Math.abs(curr.y - y1) > z) {
          panelEl.remove();
        }
      }
      this.deletePanelsTimeout = null;
    }, 550);
  }

  /** Returns the path to use in the URL for the provided coordinates. */
  getCoordinatePath(coordinates: Coordinates) {
    const panel = this.panelMap.get(toPanelKey(coordinates));
    let path = `/!/${coordinates.x}/${coordinates.y}`;
    if (panel && panel.metadata.urlSuffix) {
      path += `/${panel.metadata.urlSuffix}`;
    }
    return path;
  }

  /** Returns the starting coordinates based on the current url. */
  getStartingCoordinates(): Coordinates {
    const results = /\!\/([-\d]+)\/([-\d]+)/.exec(location.href);
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
