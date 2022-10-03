const properties = {
  isTyping: false,
  offset: 2,
  leftPaneSize: 50,
  rightPaneSize: 150,
  topPaneSize: 75,
  clickPos: { x: 0, y: 0 },
  mousePos: { x: 0, y: 0 },
  prevMouse: { x: 0, y: 0 },
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
  escape: () => canv.finishElement(),
};

const keybindsUpTyping: any = {
  control: () => canv.unsetMovingTextBox(),
};

const keybindsDown: any = {
  t: () => canv.setTool(document.getElementById("text")!),
  v: () => canv.setTool(document.getElementById("cursor")!),
  delete: () => canv.deleteElement(),
  escape: () => {
    // Hide the font dropdown
    document.getElementById("font-options")!.style.display = "none";
  },
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
  properties.clickPos = { x: e.x, y: e.y };
  canv.handleMouseDown(e);
};

const handleMouseUp = (e: MouseEvent) => {
  canv.handleMouseUp(e);
};

const handleMouseMove = (e: MouseEvent) => {
  properties.mousePos = { x: e.x, y: e.y };
  canv.handleMouseMove(e);
  properties.prevMouse = { x: e.x, y: e.y };
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

const start = () => {
  document.getElementById("top-pane")!.style.height =
    properties.topPaneSize + "px";

  document.getElementById("right-pane")!.style.width =
    properties.rightPaneSize + "px";

  document.getElementById("left-pane")!.style.width =
    properties.leftPaneSize + "px";
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

const toggleDropdown = () => {
  const el = document.getElementById("font-options")!;
  el.style.display = el.style.display === "none" ? "block" : "none";
};

const fontElement = document.getElementById("font-options")!;
for (const child of fontElement.children) {
  // @ts-ignore
  let s = child.onclick.toString();

  // @ts-ignore
  child.children[0].style.fontFamily = child.firstChild!.textContent;
}

const setFont = (value: string) => {
  // Changing the value element
  const e = document.getElementById("font-value")!;
  e.textContent = value;
  canv.font = value;
};

start();
