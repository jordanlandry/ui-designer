const properties = {
  isTyping: false,
  offset: 2,
  leftPaneSize: 75,
  rightPaneSize: 150,
  topPaneSize: 75,
};

const canv = new Canvas();

const keybindsDown: any = {
  t: () => canv.setTool(document.getElementById("text")!),
  v: () => canv.setTool(document.getElementById("cursor")!),
  delete: () => canv.deleteElement(),
};

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
  if (properties.isTyping) return;

  const key = e.key.toLowerCase();
  if (keybindsDown[key]) keybindsDown[key]();
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

// Window events
window.addEventListener("resize", handleResize);
