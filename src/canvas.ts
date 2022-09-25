// Initializing DOM elements
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas?.getContext("2d");

canvas.width = width;
canvas.height = height;

// @ts-ignore
ctx?.fillStyle = canvasColor;
ctx?.fillRect(0, 0, width, height);

// Mouse Functions
const handleMouseDown = (e: MouseEvent) => {
  logGlobals(); // Temp
  // @ts-ignore
  mouseDown = true;
  handleMouseMove(e);
};

const handleMouseUp = () => {
  logGlobals(); // Temp
  mouseDown = false;
  addToHistory();
};

const handleMouseMove = (e: MouseEvent) => {
  if (!mouseDown) return;
  logGlobals(); //

  drawRect(
    e.x - thickness / 2,
    e.y - thickness / 2,
    thickness,
    thickness,
    color
  );
};

// Keyboard functions
const handleKeydown = (e: KeyboardEvent) => {
  logGlobals(); // Temp
  let key = e.key.toLowerCase();
  if (key === "]") thickness += 1;
  if (key === "[") thickness -= 1;
  if (key === "z" && e.ctrlKey) {
    popHistory();
  }
};

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
document.addEventListener("mousedown", handleMouseDown);
document.addEventListener("mouseup", handleMouseUp);
document.addEventListener("mousemove", handleMouseMove);

// Keyboard
document.addEventListener("keydown", handleKeydown);

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
  // @ts-ignore
  if (color) ctx?.fillStyle = color;

  ctx?.fillRect(x, y, w, h);
};

const logGlobals = () => {
  console.log("Thickness: " + thickness);
  console.log("Color: " + color);
  // console.log(userHistory);
};
