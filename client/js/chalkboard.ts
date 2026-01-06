import Matrix from "./matrix.ts";
import { Coordinates, Panel } from "../../common/panel.ts";

interface CanvasCoordinate {
  x: number;
  y: number;
}

// TODO: Support multitouch events.
// TODO: Preserve image on resize.
// TODO: Handle canvas that has been zoomed out (e.g. via ']').
export default class Chalkboard {
  /** Provides information about the site grid. */
  private matrix: Matrix;

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

        globalThis.addEventListener("resize", () => updateCanvasSize(ctx));
        updateCanvasSize(ctx);
      }
    }
  }

  handleMouseEvents(panel: Panel, ctx: CanvasRenderingContext2D) {
    const coord: CanvasCoordinate = { x: 0, y: 0 };
    let mouseHandler: (event: MouseEvent) => void;

    document.addEventListener("mousedown", (e) => {
      if (isCurrentCoordinate(this.matrix.getCurrentCoordinates(), panel)) {
        mouseHandler = (event) => handleMove(event, null, ctx, coord);
        document.addEventListener("mousemove", mouseHandler);
        updateCoordinates(e, null, coord);
      }
    });

    document.addEventListener("mouseup", () => {
      if (mouseHandler) {
        document.removeEventListener("mousemove", mouseHandler);
      }
    });
  }

  handleTouchEvents(panel: Panel, ctx: CanvasRenderingContext2D) {
    const coord: CanvasCoordinate = { x: 0, y: 0 };
    let touchHandler: (event: TouchEvent) => void;

    document.addEventListener("touchstart", (e) => {
      if (isCurrentCoordinate(this.matrix.getCurrentCoordinates(), panel)) {
        touchHandler = (event) => handleMove(null, event, ctx, coord);
        document.addEventListener("touchmove", touchHandler);
        updateCoordinates(null, e, coord);
      }
    });

    document.addEventListener("touchend", () => {
      if (touchHandler) {
        document.removeEventListener("touchmove", touchHandler);
      }
    });
  }
}

function updateCanvasSize(ctx: CanvasRenderingContext2D) {
  ctx.canvas.width = globalThis.innerWidth;
  ctx.canvas.height = globalThis.innerHeight;
}

function updateCoordinates(
  mouseEvent: MouseEvent | null,
  touchEvent: TouchEvent | null,
  coord: CanvasCoordinate,
) {
  if (mouseEvent) {
    coord.x = mouseEvent.clientX;
    coord.y = mouseEvent.clientY;
  } else if (touchEvent) {
    const touch = touchEvent.touches[0];
    coord.x = touch.clientX;
    coord.y = touch.clientY;
  }
}

function handleMove(
  mouseEvent: MouseEvent | null,
  touchEvent: TouchEvent | null,
  ctx: CanvasRenderingContext2D,
  coord: CanvasCoordinate,
) {
  ctx.beginPath();
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#fff";
  ctx.moveTo(coord.x, coord.y);
  updateCoordinates(mouseEvent, touchEvent, coord);
  ctx.lineTo(coord.x, coord.y);
  ctx.stroke();
}

function isCurrentCoordinate(coord: Coordinates, panel: Panel) {
  const panelCoord = panel.metadata.coordinates;
  return coord.x === panelCoord.x && coord.y === panelCoord.y;
}
