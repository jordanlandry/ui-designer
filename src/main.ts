const canv = new Canvas();

const handleMouseDown = (e: MouseEvent) => {
  canv.handleMouseDown(e);
};
const handleMouseUp = (e: MouseEvent) => {
  canv.handleMouseUp(e);
};
const handleMouseMove = (e: MouseEvent) => {
  canv.handleMouseMove(e);
};

document.addEventListener("mousedown", handleMouseDown);
document.addEventListener("mouseup", handleMouseUp);
document.addEventListener("mousemove", handleMouseMove);
