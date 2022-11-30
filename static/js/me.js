const panelMatrixEl = document.getElementById("panel-matrix");

const DEFAULT_COORDINATES = { x: 0, y: 0 };

/** Tracks the coordinates of the currently rendered panel. */
let currentCoord = getStartingCoordinates();

goToCoordinate(currentCoord.x, currentCoord.y);
panelMatrixEl.style.display = "";

initMatrixLinks();
initKeyboardNavigation();
initTouchscreenNavigation();

function getStartingCoordinates() {
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

/** Initializes all links for the panel matrix. */
function initMatrixLinks() {
  const linkEls = document.querySelectorAll(".link");
  for (const linkEl of linkEls) {
    linkEl.addEventListener("click", (evt) => {
      const newX = parseInt(evt.target.dataset.x);
      const newY = parseInt(evt.target.dataset.y);
      goToCoordinate(newX, newY);
    });
  }
}

/** Initializes keyboard navigation. */
function initKeyboardNavigation() {
  document.addEventListener("keydown", (evt) => {
    if (evt.repeat) {
      return;
    }

    switch (evt.key) {
      case "h":
      case "a":
      case "ArrowLeft":
        goLeft();
        break;
      case "j":
      case "s":
      case "ArrowDown":
        goDown();
        break;
      case "k":
      case "w":
      case "ArrowUp":
        goUp();
        break;
      case "l":
      case "d":
      case "ArrowRight":
        goRight();
        break;
    }
  });
}

function initTouchscreenNavigation() {
  let startCoord = null;
  document.addEventListener("touchstart", (evt) => {
    const panel = evt.target.closest(".panel");
    startCoord = {
      x: evt.touches[0].clientX,
      y: evt.touches[0].clientY,
      atTop: !panel || panel.scrollTop === 0,
      atBottom:
        !panel || panel.scrollHeight <= panel.scrollTop + panel.clientHeight,
    };
  });
  document.addEventListener("touchmove", (evt) => {
    if (startCoord == null || evt.touches.length > 1) {
      return;
    }

    const xDelta = startCoord.x - evt.touches[0].clientX;
    const yDelta = startCoord.y - evt.touches[0].clientY;
    if (Math.abs(xDelta) > Math.abs(yDelta) && Math.abs(xDelta) > 50) {
      xDelta > 0 ? goRight() : goLeft();
      startCoord = null;
    } else if (Math.abs(yDelta) > 50) {
      if (yDelta > 0 && startCoord.atBottom) {
        goDown();
        startCoord = null;
      } else if (yDelta < 0 && startCoord.atTop) {
        goUp();
        startCoord = null;
      }
    }
  });
}

function goLeft() {
  goToCoordinate(currentCoord.x - 1, currentCoord.y);
}

function goRight() {
  goToCoordinate(currentCoord.x + 1, currentCoord.y);
}

function goUp() {
  goToCoordinate(currentCoord.x, currentCoord.y - 1);
}

function goDown() {
  goToCoordinate(currentCoord.x, currentCoord.y + 1);
}

/** Navigates the page to the provided coordinates. */
function goToCoordinate(x, y) {
  panelMatrixEl.style.left = `${-100 * x}vw`;
  panelMatrixEl.style.top = `${-100 * y}vh`;
  currentCoord = { x, y };
  window.history.replaceState(null, "", `/!/${x}/${y}`);
}
