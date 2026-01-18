import Matrix from "./matrix.ts";
import { Coordinates, Panel } from "../../common/panel.ts";

interface CanvasCoordinate {
  x: number;
  y: number;
}

interface Path {
  points: CanvasCoordinate[];
  color: string;
}

enum MouseButton {
  MAIN = 0,
  AUXILIARY = 1,
  SECONDARY = 2,
  BROWSER_BACK = 3,
  BROWSER_FORWARD = 4,
}

// TODO: Support multitouch events.
export default class Chalkboard {
  /** Provides information about the site grid. */
  private matrix: Matrix;

  /** An ordered list of all paths drawn by the user. */
  private paths: Path[] = [];

  /**
   * Determines the offset for the rendered canvas (e.g. after the user has
   * dragged the page).
   */
  private coordinateOffset: CanvasCoordinate = { x: 0, y: 0 };

  /** The current mouse action that is in progress, if any. */
  private mouseHandler: ((event: MouseEvent) => void) | null = null;

  constructor(matrix: Matrix) {
    this.matrix = matrix;
  }

  init() {
    for (const panel of this.matrix.listPanels()) {
      const chalkboards = panel.el.querySelectorAll<HTMLCanvasElement>(
        ".chalkboard",
      );
      for (const canvas of chalkboards) {
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return;
        }

        this.handleMouseEvents(panel, ctx);
        this.handleTouchEvents(panel, ctx);

        globalThis.addEventListener("resize", () => this.updateCanvasSize(ctx));
        this.updateCanvasSize(ctx);
      }
    }
  }

  handleMouseEvents(panel: Panel, ctx: CanvasRenderingContext2D) {
    let path: Path;

    const canvasEl = panel.el.querySelector("canvas");

    document.addEventListener("mousedown", (e) => {
      const isInputEl = (e.target as Element).tagName === "INPUT";
      if (!this.isCurrentPanel(panel) || isInputEl) {
        return;
      }

      if (this.mouseHandler) {
        document.removeEventListener("mousemove", this.mouseHandler);
      }

      let coord = getCoordinates(e, null);
      switch (e.button) {
        case MouseButton.MAIN: {
          const color = getColor(panel);
          path = { color, points: [] };
          this.addPointToPath(path, coord);
          this.mouseHandler = (event) => {
            coord = this.handleMove(event, null, ctx, coord, color);
            this.addPointToPath(path, coord);
          };
          break;
        }
        case MouseButton.AUXILIARY: {
          canvasEl?.classList.add("dragging");
          this.mouseHandler = (event) => this.handleDrag(event, ctx, coord);
          break;
        }
      }

      if (this.mouseHandler) {
        document.addEventListener("mousemove", this.mouseHandler);
      }
    });

    document.addEventListener("mouseup", () => {
      if (this.mouseHandler) {
        document.removeEventListener("mousemove", this.mouseHandler);
      }
      if (path && path.points.length > 1) {
        this.paths.push(path);
      }
      canvasEl?.classList.remove("dragging");
    });
  }

  handleTouchEvents(panel: Panel, ctx: CanvasRenderingContext2D) {
    let path: Path;
    let touchHandler: (event: TouchEvent) => void;

    document.addEventListener("touchstart", (e) => {
      if (!this.isCurrentPanel(panel)) {
        return;
      }

      if (touchHandler) {
        document.removeEventListener("touchmove", touchHandler);
      }

      let coord = getCoordinates(null, e);
      const color = getColor(panel);
      path = { color, points: [] };
      this.addPointToPath(path, coord);
      touchHandler = (event) => {
        coord = this.handleMove(null, event, ctx, coord, color);
        this.addPointToPath(path, coord);
      };
      document.addEventListener("touchmove", touchHandler);
    });

    document.addEventListener("touchend", () => {
      if (touchHandler) {
        document.removeEventListener("touchmove", touchHandler);
      }
      if (path && path.points.length > 1) {
        this.paths.push(path);
      }
    });
  }

  updateCanvasSize(ctx: CanvasRenderingContext2D) {
    ctx.canvas.width = globalThis.innerWidth;
    ctx.canvas.height = globalThis.innerHeight;
    this.drawAllPaths(ctx);
  }

  handleMove(
    mouseEvent: MouseEvent | null,
    touchEvent: TouchEvent | null,
    ctx: CanvasRenderingContext2D,
    oldCoord: CanvasCoordinate,
    color: string,
  ): Coordinates {
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.strokeStyle = color;
    ctx.moveTo(oldCoord.x, oldCoord.y);

    const newCoord = getCoordinates(mouseEvent, touchEvent);
    ctx.lineTo(newCoord.x, newCoord.y);
    ctx.stroke();

    return newCoord;
  }

  handleDrag(
    mouseEvent: MouseEvent,
    ctx: CanvasRenderingContext2D,
    coord: CanvasCoordinate,
  ) {
    const deltaX = mouseEvent.clientX - coord.x;
    const deltaY = mouseEvent.clientY - coord.y;
    this.coordinateOffset = {
      x: this.coordinateOffset.x + deltaX,
      y: this.coordinateOffset.y + deltaY,
    };
    coord.x = mouseEvent.clientX;
    coord.y = mouseEvent.clientY;
    this.drawAllPaths(ctx);
  }

  drawAllPaths(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (const path of this.paths) {
      let coord = {
        x: path.points[0].x + this.coordinateOffset.x,
        y: path.points[0].y + this.coordinateOffset.y,
      };
      for (const point of path.points) {
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        ctx.strokeStyle = path.color;
        ctx.moveTo(coord.x, coord.y);
        coord = {
          x: point.x + this.coordinateOffset.x,
          y: point.y + this.coordinateOffset.y,
        };
        ctx.lineTo(coord.x, coord.y);
        ctx.stroke();
      }
    }
  }

  // TODO: Support point sampling instead of storing every single point.
  addPointToPath(path: Path, coord: Coordinates) {
    path.points.push({
      x: coord.x - this.coordinateOffset.x,
      y: coord.y - this.coordinateOffset.y,
    });
  }

  // TODO: Handle canvas that has been zoomed out (e.g. via ']').
  /** Whether the provided panel is the currently visible panel. */
  isCurrentPanel(panel: Panel) {
    const currentCoord = this.matrix.getCurrentCoordinates();
    const panelCoord = panel.metadata.coordinates;
    return currentCoord.x === panelCoord.x && currentCoord.y === panelCoord.y;
  }
}

function getCoordinates(
  mouseEvent: MouseEvent | null,
  touchEvent: TouchEvent | null,
) {
  if (mouseEvent) {
    return { x: mouseEvent.clientX, y: mouseEvent.clientY };
  } else if (touchEvent) {
    const touch = touchEvent.touches[0];
    return { x: touch.clientX, y: touch.clientY };
  }
  return { x: 0, y: 0 };
}

function getColor(panel: Panel) {
  const colorEl = panel.el.querySelector(".canvas-color") as HTMLInputElement;
  return colorEl ? colorEl.value : "#fff";
}
