const properties = {
  isTyping: false,
  offset: 2,
  leftPaneSize: 75,
  rightPaneSize: 150,
  topPaneSize: 75,
};

const canv = new Canvas();

const handleGreaterThanKey = (e: KeyboardEvent) => {
  if (e.ctrlKey && e.shiftKey) canv.updateFontSize(true);
};

const handleLessThanKey = (e: KeyboardEvent) => {
  if (e.ctrlKey && e.shiftKey) canv.updateFontSize(false);
};

const keybindsTyping: any = {
  ">": (e: KeyboardEvent) => handleGreaterThanKey(e),
  "<": (e: KeyboardEvent) => handleLessThanKey(e),
  control: () => canv.setMovingTextBox(),
};

const keybindsUpTyping: any = {
  control: () => canv.unsetMovingTextBox(),
};

const keybindsDown: any = {
  t: () => canv.setTool(document.getElementById("text")!),
  v: () => canv.setTool(document.getElementById("cursor")!),
  delete: () => canv.deleteElement(),
};

const keybindsUp: any = {};

const unclickableElements = [
  document.getElementById("top-pane"),
  document.getElementById("left-pane"),
  document.getElementById("right-pane"),
  document.getElementById("pane-wrapper"),
  document.getElementById("body"),
  canv.canvas,
];

const handleMouseDown = (e: MouseEvent) => {
  canv.handleMouseDown(e);
};

const handleMouseUp = (e: MouseEvent) => {
  canv.handleMouseUp(e);
};

const handleMouseMove = (e: MouseEvent) => {
  canv.handleMouseMove(e);
};

const handleKeydown = (e: KeyboardEvent) => {
  const key = e.key.toLowerCase();
  if (properties.isTyping) {
    if (keybindsTyping[key]) keybindsTyping[key](e);
  } else if (keybindsDown[key] && keybindsDown[key]) keybindsDown[key](e);
};

const handleKeyup = (e: KeyboardEvent) => {
  const key = e.key.toLowerCase();
  if (properties.isTyping) {
    if (keybindsUpTyping[key]) keybindsUpTyping[key](e);
  } else if (keybindsUp[key] && keybindsUp[key]) keybindsUp[key](e);
};

const handleResize = () => {
  canv.handleResize();
};

// Mouse Events
document.addEventListener("mousedown", handleMouseDown);
document.addEventListener("mouseup", handleMouseUp);
document.addEventListener("mousemove", handleMouseMove);

// Keyboard events
document.addEventListener("keydown", handleKeydown);
document.addEventListener("keyup", handleKeyup);

// Window events
window.addEventListener("resize", handleResize);
