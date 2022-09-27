"use strict";
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
const setColor = (newColor) => {
    colorElement.style.backgroundColor = newColor;
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
const keybindsDown = {
    escape: () => handleEscape(),
    "]": () => canv.updateThickness(true),
    "[": () => canv.updateThickness(false),
};
const keybindsUp = {};
// Event listeners
const handleKeydown = (e) => {
    if (keybindsDown[e.key])
        keybindsDown[e.key]();
};
const handleKeyup = (e) => {
    if (keybindsUp[e.key])
        keybindsUp[e.key]();
};
const handleMousedown = (e) => {
    colorWheel.handleMouseDown(e);
    canv.handleMouseDown(e);
};
const handleMouseup = (e) => {
    colorWheel.handleMouseUp(e);
    canv.handleMouseUp(e);
};
const handleMousemove = (e) => {
    colorWheel.handleMouseMove(e);
    canv.handleMouseMove(e);
    cursorLayer.handleMouseMove(e);
};
const handleResize = (e) => {
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
