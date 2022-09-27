// Dom elements
const thicknessElement = document.getElementById("thickness");
const colorElement = document.getElementById("color");

// Global variables
const width = 500;
const height = 500;
const defaultColor = "black";
const defaultCanvasColor = "white";

const properties = {
  color: defaultCanvasColor,
  leftPaneSize: 52,
  topPaneSize: 57,
  rightPaneSize: 121,
};

const setColor = (newColor: string) => {
  colorElement!.style.backgroundColor = newColor;
  properties.color = newColor;
};

setColor(defaultColor);
const colorWheel = new ColorWheel(properties, setColor);
const canv = new Canvas();

canv.createNewLayer();

const keybindsDown: any = {
  escape: () => handleEscape(),
};

const handleEscape = () => {
  colorWheel.hide();
};

const logGlobals = () => {
  // console.log(properties);
};
