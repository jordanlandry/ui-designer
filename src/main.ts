// Dom elements
const thicknessElement = document.getElementById("thickness");
const colorElement = document.getElementById("color");

// Global variables

const defaultValues = {
  color: "black",
  background: "white",
};

const properties = {
  leftPaneSize: 52,
  topPaneSize: 57,
  rightPaneSize: 121,
  offset: 0,
};

const setColor = (newColor: string) => {
  colorElement!.style.backgroundColor = newColor;
};

const colorWheel = new ColorWheel(properties, setColor);
const canv = new Canvas();

canv.createNewLayer();
const cursorLayer = canv.createNewLayer(true);

const handleEscape = () => {
  colorWheel.hide();
};

const logGlobals = () => {
  // console.log(properties);
};

const keybindsDown: any = {
  escape: () => handleEscape(),
  "]": () => canv.updateThickness(true),
  "[": () => canv.updateThickness(false),
};

const keybindsUp: any = {};

// Event listeners
const handleKeydown = (e: KeyboardEvent) => {
  if (keybindsDown[e.key]) keybindsDown[e.key]();
};

const handleKeyup = (e: KeyboardEvent) => {
  if (keybindsUp[e.key]) keybindsUp[e.key]();
};

const handleMousedown = (e: MouseEvent) => {
  colorWheel.handleMouseDown(e);
  canv.handleMouseDown(e);
};

const handleMouseup = (e: MouseEvent) => {
  colorWheel.handleMouseUp(e);
  canv.handleMouseUp(e);
};

const handleMousemove = (e: MouseEvent) => {
  colorWheel.handleMouseMove(e);
  canv.handleMouseMove(e);
  cursorLayer.handleMouseMove(e);
};

const handleResize = (e: any) => {
  canv.handleResize(e);
};

const save = () => {
  for (const layer of canv.layers) {
    console.log(layer.data);
  }
};

document.addEventListener("keydown", handleKeydown);
document.addEventListener("keyup", handleKeyup);
document.addEventListener("mouseup", handleMouseup);
document.addEventListener("mousedown", handleMousedown);
document.addEventListener("mousemove", handleMousemove);

window.addEventListener("resize", (e) => handleResize(e));
