import Matrix from "./matrix.ts";

const LEFT_BUTTONS = new Set(["h", "a", "ArrowLeft", "1", "4", "7"]);
const DOWN_BUTTONS = new Set(["j", "s", "ArrowDown", "1", "2", "3"]);
const UP_BUTTONS = new Set(["k", "w", "ArrowUp", "7", "8", "9"]);
const RIGHT_BUTTONS = new Set(["l", "d", "ArrowRight", "3", "6", "9"]);
const ZOOM_OUT_BUTTONS = new Set(["]"]);
const ZOOM_IN_BUTTONS = new Set(["["]);

export default class Commander {
  /** Provides information about the site grid. */
  private matrix: Matrix;

  constructor(matrix: Matrix) {
    this.matrix = matrix;
  }

  init() {
    document.addEventListener("keydown", (e) => this.handleKeys(e));
  }

  /** Initializes keyboard navigation. */
  private handleKeys(e: KeyboardEvent) {
    if (e.repeat) {
      return;
    }

    if (LEFT_BUTTONS.has(e.key)) {
      this.matrix.goLeft();
    }
    if (DOWN_BUTTONS.has(e.key)) {
      this.matrix.goDown();
    }
    if (RIGHT_BUTTONS.has(e.key)) {
      this.matrix.goRight();
    }
    if (UP_BUTTONS.has(e.key)) {
      this.matrix.goUp();
    }
    if (ZOOM_OUT_BUTTONS.has(e.key)) {
      this.matrix.zoomOut();
    }
    if (ZOOM_IN_BUTTONS.has(e.key)) {
      this.matrix.zoomIn();
    }
  }
}
