/** The gravitational constant for this shoddy simulation .*/
const G = 10;

/** The pixel factor. Speeds up the affect velocity has on a body. */
const PF = 20;

/** Minimum distance between bodies to avoid slingshots. */
const MIN_DIST = 100;

class Three {
  /** List containing the three bodies. */
  #bodies;

  /** The button that starts the simulation. */
  #playEl;

  /** Whether the simulation is running. */
  #running;

  constructor() {
    this.#running = false;
    this.#bodies = [];
    for (const body of document.getElementsByClassName("three-body")) {
      this.#bodies.push({ el: body });
    }
    this.#playEl = document.getElementById("three-play");

    this.#playEl.addEventListener("click", (evt) => {
      if (this.#running) {
        // The user clicked the start button on a running simulation, so reset
        // the bodies.
        this.init();
        return;
      }

      // The user is starting the sim for the first time, kick it off.
      window.requestAnimationFrame(() => this.#step());
      this.#playEl.innerText = "Restart";
      this.#running = true;
    });

    window.addEventListener("coordinatechange", () => {
      if (this.#running) {
        this.#playEl.innerText = "Continue";
        this.#running = false;
      }
    });
  }

  /** Set up initial coordinates of the bodies. */
  init() {
    const maxWidth = window.innerWidth;
    const maxHeight = window.innerHeight;
    for (const body of this.#bodies) {
      const x = 0.25 * maxWidth + Math.floor(0.5 * Math.random() * maxWidth);
      const y = 0.25 * maxHeight + Math.floor(0.5 * Math.random() * maxHeight);
      this.#setCoord(body, x, y);
      body.m = 30 + 30 * Math.random();
      body.v_x = 0;
      body.v_y = 0;
      body.el.classList.add("show");
    }
  }

  /** Runs a step of the simulation. */
  #step() {
    const a = this.#bodies[0];
    const b = this.#bodies[1];
    const c = this.#bodies[2];

    const ab_dist = this.#dist(a, b);
    const force_ab = (-1 * (G * a.m * b.m)) / Math.pow(ab_dist, 2);
    const force_ab_x = (force_ab * (a.x - b.x)) / ab_dist;
    const force_ab_y = (force_ab * (a.y - b.y)) / ab_dist;

    const ac_dist = this.#dist(a, c);
    const force_ac = (-1 * (G * a.m * c.m)) / Math.pow(ac_dist, 2);
    const force_ac_x = (force_ac * (a.x - c.x)) / ac_dist;
    const force_ac_y = (force_ac * (a.y - c.y)) / ac_dist;

    const bc_dist = this.#dist(b, c);
    const force_bc = (-1 * (G * b.m * c.m)) / Math.pow(bc_dist, 2);
    const force_bc_x = (force_bc * (b.x - c.x)) / bc_dist;
    const force_bc_y = (force_bc * (b.y - c.y)) / bc_dist;

    a.v_x += (force_ab_x + force_ac_x) / a.m;
    a.v_y += (force_ab_y + force_ac_y) / a.m;
    this.#setCoord(a, a.x + a.v_x * PF, a.y + a.v_y * PF);

    b.v_x += (force_bc_x - force_ab_x) / b.m;
    b.v_y += (force_bc_y - force_ab_y) / b.m;
    this.#setCoord(b, b.x + b.v_x * PF, b.y + b.v_y * PF);

    c.v_x += (-1 * force_ac_x - force_bc_x) / c.m;
    c.v_y += (-1 * force_ac_y - force_bc_y) / c.m;
    this.#setCoord(c, c.x + c.v_x * PF, c.y + c.v_y * PF);

    if (this.#running) {
      window.requestAnimationFrame(() => this.#step());
    }
  }

  /** Computes the distance between two bodies. */
  #dist(a, b) {
    const actual = Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    return Math.max(actual, MIN_DIST);
  }

  /** Sets the coordinates for the provided body. */
  #setCoord(body, x, y) {
    body.x = x;
    body.y = y;
    body.el.style.left = x + "px";
    body.el.style.bottom = y + "px";
  }
}

function loadModule() {
  new Three().init();
}

export { loadModule };
