// Initializing DOM elements
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas?.getContext("2d");

canvas.width = width;
canvas.height = height;

ctx!.fillStyle = properties.canvasColor;
ctx?.fillRect(0, 0, width, height);

// Mouse Functions
const handleMouseDown = (e: MouseEvent) => {
  logGlobals(); // Temp

  // Update global variables
  mouseDown = true;

  handleMouseMove(e);
  colorWheel.hide();
};

const handleMouseUp = () => {
  logGlobals(); // Temp
  mouseDown = false;
  addToHistory();
};

const handleMouseMove = (e: MouseEvent) => {
  // Update global variables

  if (!mouseDown) return;
  let x = e.x;
  let y = e.y;

  logGlobals(); //

  drawRect(
    x - properties.thickness / 2,
    y - properties.thickness / 2,
    properties.thickness,
    properties.thickness,
    properties.color
  );
};

// Keyboard functions

const addToHistory = () => {
  // userHistory.push(state);
};

const popHistory = () => {
  // if (!userHistory.length) return;
  // let i = userHistory.length - 1;
  // let j = 0;
  // for (const p of userHistory[i]) {
  //   let { x, y, thickness, color } = p;
  //   j++;
  //   drawRect(
  //     x - thickness / 2,
  //     y - thickness / 2,
  //     thickness + 5,
  //     thickness + 5,
  //     canvasColor
  //   );
  // }
  // let i = userHistory.length - 2;
  // if (i) state = userHistory[i];
  // userHistory.pop();
};

// Mouse
canvas.addEventListener("mousedown", handleMouseDown);
document.addEventListener("mouseup", handleMouseUp);
canvas.addEventListener("mousemove", handleMouseMove);

// State
const updateCurrentState = () => {
  // currentState;
};

// Canvas functions
const drawRect = (
  x: number,
  y: number,
  w: number,
  h: number,
  color?: string
) => {
  if (properties.currentTool === "eraser") color = properties.canvasColor;

  if (color) ctx!.fillStyle = color;

  x = x - canvas.offsetLeft;
  y = y - canvas.offsetTop;

  ctx?.fillRect(x, y, w, h);
};
