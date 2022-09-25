// Canvas Defining
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas?.getContext("2d");

canvas.width = 1000;
canvas.height = 1000;

// Global variables
let mouseDown = false;
// let userHistory = new ListNode(0);
// let mostPreviousHistory = userHistory.getLastValue();
const userHistory: any = [];
let thickness = 1;
let color = "white";
let canvasColor = "black";

let currentPath: any = [];

// @ts-ignore
ctx?.fillStyle = "black";
ctx?.fillRect(0, 0, 1000, 1000);

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
  userHistory.push(currentPath);
  currentPath = [];
};

const handleMouseMove = (e: MouseEvent) => {
  if (!mouseDown) return;
  logGlobals();

  let x = e.x - thickness / 2;
  let y = e.y - thickness / 2;
  drawRect(x, y, thickness, thickness, color);

  currentPath.push({ x: e.x, y: e.y, thickness, color });
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

const addToHistory = (e: any) => {
  userHistory.push({ x: e.x, y: e.y });
};

const popHistory = () => {
  if (!userHistory.length) return;
  let i = userHistory.length - 1;

  let j = 0;
  for (const p of userHistory[i]) {
    let { x, y, thickness, color } = p;

    j++;
    drawRect(
      x - thickness / 2,
      y - thickness / 2,
      thickness + 5,
      thickness + 5,
      canvasColor
    );
  }

  userHistory.pop();
};

// Mouse
document.addEventListener("mousedown", handleMouseDown);
document.addEventListener("mouseup", handleMouseUp);
document.addEventListener("mousemove", handleMouseMove);

// Keyboard
document.addEventListener("keydown", handleKeydown);

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
  console.log(userHistory);
};
