const LEFT_BUTTONS = new Set(["h", "a", "ArrowLeft", "1", "4", "7"]);
const DOWN_BUTTONS = new Set(["j", "s", "ArrowDown", "1", "2", "3"]);
const UP_BUTTONS = new Set(["k", "w", "ArrowUp", "7", "8", "9"]);
const RIGHT_BUTTONS = new Set(["l", "d", "ArrowRight", "3", "6", "9"]);
const ZOOM_OUT_BUTTONS = new Set(["]"]);
const ZOOM_IN_BUTTONS = new Set(["["]);

class Commander {
  /** Provides information about the site grid. */
  #matrix;

  constructor(matrix) {
    this.#matrix = matrix;
  }

  init() {
    document.addEventListener("keydown", (evt) => this.#handleKeys(evt));
  }

  /** Initializes keyboard navigation. */
  #handleKeys(evt) {
    if (evt.repeat) {
      return;
    }

    if (LEFT_BUTTONS.has(evt.key)) {
      this.#matrix.goLeft();
    }
    if (DOWN_BUTTONS.has(evt.key)) {
      this.#matrix.goDown();
    }
    if (RIGHT_BUTTONS.has(evt.key)) {
      this.#matrix.goRight();
    }
    if (UP_BUTTONS.has(evt.key)) {
      this.#matrix.goUp();
    }
    if (ZOOM_OUT_BUTTONS.has(evt.key)) {
      this.#matrix.zoomOut();
    }
    if (ZOOM_IN_BUTTONS.has(evt.key)) {
      this.#matrix.zoomIn();
    }
  }
}

export { Commander };
