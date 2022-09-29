const canv = new Canvas();

const keybindsDown: any = {
  t: () => canv.setTool(document.getElementById("text")!),
  v: () => canv.setTool(document.getElementById("cursor")!),
};

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
  if (keybindsDown[e.key]) keybindsDown[e.key]();
};

document.addEventListener("mousedown", handleMouseDown);
document.addEventListener("mouseup", handleMouseUp);
document.addEventListener("mousemove", handleMouseMove);

document.addEventListener("keydown", handleKeydown);
