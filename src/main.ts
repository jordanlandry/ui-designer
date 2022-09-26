// Dom elements
const thicknessElement = document.getElementById("thickness");
const colorElement = document.getElementById("color");

// Global variables
const width = 500;
const height = 500;
const defaultColor = "black";
const defaultCanvasColor = "white";

let mouseDown = false;

const properties = {
  color: defaultColor,
  canvasColor: defaultCanvasColor,
  currentTool: "pencil",
  thickness: 10,
};

const setColor = (newColor: string) => {
  colorElement!.style.backgroundColor = newColor;
  properties.color = newColor;
};

setColor(defaultColor);
const colorWheel = new ColorWheel(properties, setColor);

const setTool = (newTool: string) => {
  document.getElementById(properties.currentTool)!.className = "tool";
  document.getElementById(newTool)!.className += " active";
  properties.currentTool = newTool;
};

const updateThickness = (isUp: boolean) => {
  if (isUp) properties.thickness += 1;
  else if (properties.thickness === 1) return;
  else properties.thickness -= 1;

  thicknessElement!.textContent = properties.thickness.toString();
};

const keybindsDown: any = {
  "]": () => updateThickness(true),
  "[": () => updateThickness(false),
  e: () => setTool("eraser"),
  p: () => setTool("pencil"),
  escape: () => colorWheel.hide(),
};

const handleKeydown = (e: KeyboardEvent) => {
  logGlobals(); // Temp
  let key = e.key.toLowerCase();
  if (keybindsDown[key]) {
    keybindsDown[key]();
  }
};

// Event Listeners
// Keyboard
document.addEventListener("keydown", handleKeydown);

const logGlobals = () => {
  // console.log(properties);
};
