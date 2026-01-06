import Matrix from "./matrix.ts";
import { Coordinates, Panel } from "../../common/panel.ts";

interface CanvasCoordinate {
  x: number;
  y: number;
}

// TODO: Support touch events.
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
        const coord: CanvasCoordinate = { x: 0, y: 0 };
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return;
        }

        let handler: (event: MouseEvent) => void;

        document.addEventListener("mousedown", (e) => {
          if (isCurrentCoordinate(this.matrix.getCurrentCoordinates(), panel)) {
            handler = (event) => handleMouseMove(event, ctx, coord);
            document.addEventListener("mousemove", handler);
            updateCoordinates(e, coord);
          }
        });

        document.addEventListener("mouseup", (e) => {
          if (handler) {
            document.removeEventListener("mousemove", handler);
          }
        });

        globalThis.addEventListener("resize", () => updateCanvasSize(ctx));
        updateCanvasSize(ctx);
      }
    }
  }
}

function updateCanvasSize(ctx: CanvasRenderingContext2D) {
  ctx.canvas.width = globalThis.innerWidth;
  ctx.canvas.height = globalThis.innerHeight;
}

function updateCoordinates(event: MouseEvent, coord: CanvasCoordinate) {
  coord.x = event.clientX;
  coord.y = event.clientY;
}

function handleMouseMove(
  event: MouseEvent,
  ctx: CanvasRenderingContext2D,
  coord: CanvasCoordinate,
) {
  ctx.beginPath();
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#fff";
  ctx.moveTo(coord.x, coord.y);
  updateCoordinates(event, coord);
  ctx.lineTo(coord.x, coord.y);
  ctx.stroke();
}

function isCurrentCoordinate(coord: Coordinates, panel: Panel) {
  const panelCoord = panel.metadata.coordinates;
  return coord.x === panelCoord.x && coord.y === panelCoord.y;
}
