// Dom elements
const thicknessElement = document.getElementById("thickness");
const colorElement = document.getElementById("color");

// Global variables
const width = 500;
const height = 500;

let mouseDown = false;

const properties = {
  color: "white",
  canvasColor: "black",
  currentTool: "pencil",
  thickness: 10,
};

const setColor = (newColor: string) => {
  colorElement!.style.backgroundColor = newColor;
  properties.color = newColor;
};

const colorWheel = new ColorWheel(properties, setColor);

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
};

const keybinds: any = {
  "]": () => updateThickness(true),
  "[": () => updateThickness(false),
  e: () => setTool("eraser"),
  p: () => setTool("pencil"),
  escape: () => colorWheel.hide(),
};

const handleKeydown = (e: KeyboardEvent) => {
  logGlobals(); // Temp
  let key = e.key.toLowerCase();
  if (keybinds[key]) {
    keybinds[key]();
  }

  // if (key === "]") properties.thickness += 1;
  // if (key === "[") properties.thickness -= 1;
  // if (key === "e") properties.currentTool = "eraser";
  // if (key === "p") properties.currentTool = "pencil";
  // if (key === "z" && e.ctrlKey) {
  //   popHistory();
  // }
};

// Event Listeners
// Keyboard
document.addEventListener("keydown", handleKeydown);

const logGlobals = () => {
  // console.log(properties);
};
