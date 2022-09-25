// Dom elements
const thicknessElement = document.getElementById("thickness");

// Global variables
const width = 500;
const height = 500;

let mouseDown = false;

const properties = {
  color: "white",
  canvasColor: "black",
  currentTool: "pencil",
  thickness: 1,
};

const setColor = (newColor: string) => {
  properties.color = newColor;
};

const setTool = (newTool: string) => {
  properties.currentTool = newTool;
};

const updateThickness = (isUp: boolean) => {
  if (isUp) properties.thickness += 1;
  else if (properties.thickness === 1) return;
  else properties.thickness -= 1;

  // @ts-ignore
  thicknessElement?.textContent = properties.thickness;
};

const keybinds: any = {
  "]": () => updateThickness(true),
  "[": () => updateThickness(false),
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
  console.log(properties);
};
