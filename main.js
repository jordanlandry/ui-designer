"use strict";
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
const handleGreaterThanKey = (e) => {
    if (e.ctrlKey && e.shiftKey)
        canv.updateFontSize(true);
};
const handleLessThanKey = (e) => {
    if (e.ctrlKey && e.shiftKey)
        canv.updateFontSize(false);
};
const keybindsTyping = {
    ">": (e) => handleGreaterThanKey(e),
    "<": (e) => handleLessThanKey(e),
    control: () => canv.setMovingTextBox(),
    escape: () => canv.finishElement(),
};
const keybindsUpTyping = {
    control: () => canv.unsetMovingTextBox(),
};
const keybindsDown = {
    t: () => canv.setTool(document.getElementById("text")),
    v: () => canv.setTool(document.getElementById("cursor")),
    delete: () => canv.deleteElement(),
};
const keybindsUp = {};
const unclickableElements = [
    document.getElementById("top-pane"),
    document.getElementById("left-pane"),
    document.getElementById("right-pane"),
    document.getElementById("pane-wrapper"),
    document.getElementById("body"),
    canv.canvas,
];
const handleMouseDown = (e) => {
    properties.clickPos = { x: e.x, y: e.y };
    canv.handleMouseDown(e);
};
const handleMouseUp = (e) => {
    canv.handleMouseUp(e);
};
const handleMouseMove = (e) => {
    properties.mousePos = { x: e.x, y: e.y };
    canv.handleMouseMove(e);
    properties.prevMouse = { x: e.x, y: e.y };
};
const handleKeydown = (e) => {
    const key = e.key.toLowerCase();
    if (properties.isTyping) {
        if (keybindsTyping[key])
            keybindsTyping[key](e);
    }
    else if (keybindsDown[key] && keybindsDown[key])
        keybindsDown[key](e);
};
const handleKeyup = (e) => {
    const key = e.key.toLowerCase();
    if (properties.isTyping) {
        if (keybindsUpTyping[key])
            keybindsUpTyping[key](e);
    }
    else if (keybindsUp[key] && keybindsUp[key])
        keybindsUp[key](e);
};
const handleResize = () => {
    canv.handleResize();
};
const start = () => {
    document.getElementById("top-pane").style.height =
        properties.topPaneSize + "px";
    document.getElementById("right-pane").style.width =
        properties.rightPaneSize + "px";
    document.getElementById("left-pane").style.width =
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
start();
