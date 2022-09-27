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
  leftPaneSize: 52,
  topPaneSize: 57,
  rightPaneSize: 121,
  offset: 0,
  typing: false,
  fontSize: 10,
  padding: 20,
  activeLayer: "l1",
};

const setColor = (newColor: string) => {
  colorElement!.style.backgroundColor = newColor;
  properties.color = newColor;
};

setColor(defaultColor);
const colorWheel = new ColorWheel(properties, setColor);
const canv = new Canvas();

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

  canv.drawCursor(canv.moveX, canv.moveY);
};

const updateFontSize = (isUp: boolean, ctrl: boolean, shift: boolean) => {
  if (!ctrl || !shift) return;
  if (isUp) properties.fontSize++;
  else properties.fontSize--;
};

const setActiveLayer = (id: string) => {
  if (document.getElementById(properties.activeLayer)) {
    document.getElementById(properties.activeLayer)!.className =
      "layer-preview";
  }
  properties.activeLayer = id;
  document.getElementById(id)!.className += " active";
};
canv.createNewLayer();

const keybindsDown: any = {
  "]": () => updateThickness(true),
  "[": () => updateThickness(false),
  e: () => setTool("eraser"),
  p: () => setTool("pencil"),
  g: () => setTool("bucket"),
  l: () => setTool("line"),
  t: () => setTool("text"),
  escape: () => handleEscape(),
};

const handleEscape = () => {
  colorWheel.hide();
  properties.typing = false;
};

const handleKeydown = (e: KeyboardEvent) => {
  logGlobals(); // Temp

  if (properties.typing) {
    if (e.key === ">") updateFontSize(true, e.ctrlKey, e.shiftKey);
    else if (e.key === "<") updateFontSize(false, e.ctrlKey, e.shiftKey);
  }

  let key = e.key.toLowerCase();
  if (keybindsDown[key]) {
    keybindsDown[key]();
  }
};

const handleScroll = (e: WheelEvent) => {
  if (e.ctrlKey) {
    e.preventDefault();

    canv.handleZoom(e);
  } else if (e.shiftKey) {
    e.preventDefault();
    canv.handleSlide(e);
  }
};
// Event Listeners
document.addEventListener("wheel", handleScroll, { passive: false });
// Keyboard
document.addEventListener("keydown", handleKeydown);

const logGlobals = () => {
  // console.log(properties);
};
