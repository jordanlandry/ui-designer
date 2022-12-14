const defaultCanv = {
  tool: "cursor",
  clickPos: null,
  unclickPos: null,
  mousePos: null,
  prevMouse: null,
  width: 0,
  height: 0,
  elements: [],
  mouseDown: false,
  clickedElement: null,
  fontSize: 24,
  activeElement: null,
  movingTextBox: false,
  font: "Arial",
  color: "black",
  changingFontSize: false,

  italic: false,
  bold: false,
  underline: false,

  clickTime: 0,
  lastClickTime: 0,

  defaultCanvColor: "white",
};

class Canvas {
  tool: string;
  clickPos: { x: number; y: number } | null;
  unclickPos: { x: number; y: number } | null;
  mousePos: { x: number; y: number } | null;
  prevMouse: { x: number; y: number } | null;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  activeElement: any;
  elements: any;
  mouseDown: boolean;
  clickedElement: any;
  movingTextBox: boolean;
  font: string;
  color: string;
  changingFontSize: boolean;

  clickTime: number;
  lastClickTime: number;

  italic: boolean;
  bold: boolean;
  underline: boolean;

  defaultCanvColor: string;
  fontSize: number;

  constructor() {
    // Default values
    this.tool = defaultCanv.tool;
    this.clickPos = defaultCanv.clickPos;
    this.unclickPos = defaultCanv.unclickPos;
    this.mousePos = defaultCanv.mousePos;
    this.prevMouse = defaultCanv.prevMouse;
    this.width = defaultCanv.width;
    this.height = defaultCanv.height;
    this.elements = defaultCanv.elements;
    this.mouseDown = defaultCanv.mouseDown;
    this.clickedElement = defaultCanv.clickedElement;
    this.fontSize = defaultCanv.fontSize;
    this.movingTextBox = defaultCanv.movingTextBox;
    this.changingFontSize = defaultCanv.changingFontSize;

    this.font = defaultCanv.font;
    this.defaultCanvColor = defaultCanv.defaultCanvColor;

    this.italic = defaultCanv.italic;
    this.bold = defaultCanv.bold;
    this.underline = defaultCanv.underline;

    this.clickTime = defaultCanv.clickTime;
    this.lastClickTime = defaultCanv.lastClickTime;

    this.color = defaultCanv.color;

    this.activeElement = null;

    // Canvas properties
    this.canvas = document.createElement("canvas");
    this.setWidthAndHeight();
    this.ctx = this.canvas.getContext("2d")!;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas.style.position = "absolute";
    this.canvas.style.top = properties.topPaneSize + "px";
    this.canvas.style.left = properties.leftPaneSize + "px";
    this.canvas.style.border = "1px solid black";
    document.getElementById("body")?.appendChild(this.canvas);

    this.editDomValuesToDefaults();
  }

  drawBlankCanvas() {
    this.ctx.fillStyle = this.defaultCanvColor;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  editDomValuesToDefaults() {
    const f = document.getElementById("font-value")!;
    f.textContent = this.font;

    const i = document.getElementById("font-size") as HTMLInputElement;
    i.value = this.fontSize + "";

    document.getElementById("color-selector")!.style.backgroundColor =
      this.color;

    const p = document.getElementById("top-pane")!;
    for (const child of p.children) {
      document.getElementById(child.id)!.style.display = "none";
    }

    if (document.getElementById(`${this.tool}-pane`))
      document.getElementById(`${this.tool}-pane`)!.style.display = "flex";
    else document.getElementById(`default-pane`)!.style.display = "flex";

    // document.getElementById("delete-cursor");
  }

  setTool(e: HTMLElement) {
    if (this.tool === "text") this.finishElement();

    // Hide the current top pane
    if (document.getElementById(`${this.tool}-pane`))
      document.getElementById(`${this.tool}-pane`)!.style.display = "none";
    else document.getElementById("default-pane")!.style.display = "none";

    // Set the active className on the dom element
    document.getElementById(this.tool)!.className = "tool";
    document.getElementById(e.id)!.className += " active";
    this.tool = e.id;

    // Show the new tool pane
    if (document.getElementById(`${this.tool}-pane`))
      document.getElementById(`${this.tool}-pane`)!.style.display = "flex";
    else document.getElementById("default-pane")!.style.display = "flex";

    // Check if the text pane is being shown
    if (
      document.getElementById(`text-pane`)!.style.display === "flex" &&
      this.tool !== "text"
    ) {
      document.getElementById(`text-pane`)!.style.display = "none";
    }
  }

  setWidthAndHeight() {
    this.width =
      window.innerWidth - properties.leftPaneSize - properties.rightPaneSize;

    this.height =
      window.innerHeight - properties.topPaneSize - properties.offset;

    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  strokeRect(e: MouseEvent) {
    if (
      e.target !== this.canvas ||
      this.clickedElement !== document.getElementById("body")
    )
      return;

    if (this.tool === "text" && this.mouseDown) {
      this.drawBlankCanvas();
      this.ctx.strokeStyle = "black";
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(
        this.clickPos!.x,
        this.clickPos!.y,
        e.offsetX - this.clickPos!.x,
        e.offsetY - this.clickPos!.y
      );
    }
  }

  setColor(e: HTMLElement) {
    e.style.backgroundColor = "black";
  }

  // ~~~ TOOLS ~~~ \\
  useTool() {
    if (this.tool === "text") {
      properties.isTyping = true;

      if (this.activeElement) {
        this.activeElement.style.display = "none";
        this.activeElement = null;
      }

      // Create text area
      let t = document.createElement("textarea");

      // Positioning
      t.style.position = "absolute";
      t.style.left = `${this.clickPos?.x! + properties.leftPaneSize}px`;
      t.style.top = `${this.clickPos?.y! + properties.topPaneSize}px`;

      // Style
      t.style.border = "none";
      t.style.outline = "1px solid black";
      t.style.fontFamily = this.font;
      t.style.color = this.color;

      // Decoration
      t.style.textDecoration = this.underline ? "underline" : "";
      t.style.fontWeight = this.bold ? "bold" : "";
      t.style.fontStyle = this.italic ? "italic" : "";

      // Sizing
      t.style.width = this.unclickPos!.x - this.clickPos!.x + "px";
      t.style.height = this.unclickPos!.y - this.clickPos!.y + "px";
      t.style.fontSize = this.fontSize + "px";
      t.style.margin = "0";
      t.style.padding = "0";

      t.style.backgroundColor = "transparent";

      document.getElementById("body")?.appendChild(t);
      this.activeElement = t;
      t.focus();
    }

    if (this.tool === "cursor") this.handleCursorTool();
  }

  handleCursorTool() {
    if (!this.mouseDown) return;
    for (const el of unclickableElements) {
      if (this.clickedElement === el) return;
    }

    // Get position
    let left = parseInt(this.clickedElement.style.left.replaceAll("px", ""));
    let top = parseInt(this.clickedElement.style.top.replaceAll("px", ""));

    // Move position
    if (this.prevMouse) {
      left += this.mousePos!.x - this.prevMouse!.x;
      top += this.mousePos!.y - this.prevMouse!.y;
    }

    // Set position of DOM element
    this.clickedElement.style.outline = "1px solid black";
    this.clickedElement.style.left = left + "px";
    this.clickedElement.style.top = top + "px";
  }

  handleMoveTextBox() {
    if (!this.movingTextBox) return;

    let left = parseInt(this.activeElement.style.left.replaceAll("px", ""));
    let top = parseInt(this.activeElement.style.top.replaceAll("px", ""));

    if (this.prevMouse) {
      left += this.mousePos!.x - this.prevMouse!.x;
      top += this.mousePos!.y - this.prevMouse!.y;
    }

    this.activeElement.style.left = left + "px";
    this.activeElement.style.top = top + "px";
  }

  setMovingTextBox() {
    this.movingTextBox = true;
    if (this.activeElement) this.activeElement.style.cursor = "pointer";
  }

  unsetMovingTextBox() {
    this.movingTextBox = false;
    if (this.activeElement) this.activeElement.style.cursor = "text";
  }

  deleteElement() {
    if (this.clickedElement === null || this.clickedElement.id === "body")
      return;
    this.clickedElement.style.display = "none";
  }

  finishElement() {
    if (!this.activeElement) return;
    // Reset the textBox properties
    this.unsetMovingTextBox();

    // Create a wrapper for the text element
    let d = document.createElement("div");
    d.style.position = "absolute";
    d.style.left = `${this.activeElement?.style.left}`;
    d.style.top = `${this.activeElement?.style.top}`;
    d.style.width = this.activeElement.style.width;
    d.style.height = this.unclickPos!.y - this.clickPos!.y + "px";
    d.style.margin = "0";

    let l = this.activeElement.value.length;
    let p = document.createElement("p");
    p.style.margin = "0";
    p.style.fontSize = this.fontSize + "px";
    p.style.display = "block";
    p.style.width = "inherit";
    p.style.wordWrap = "break-word";
    p.style.fontFamily = this.font;
    p.style.color = this.color;

    p.style.textDecoration = this.underline ? "underline" : "";
    p.style.fontWeight = this.bold ? "bold" : "";
    p.style.fontStyle = this.italic ? "italic" : "";

    // Check for new lines
    for (let i = 0; i < l; i++) {
      if (this.activeElement.value[i] === "\n" || i === l - 1) {
        if (i === l - 1) p.textContent += this.activeElement.value[i];
        else d.append(document.createElement("br"));
        d.appendChild(p);
        p = document.createElement("p");
        p.style.margin = "0";
        p.style.display = "inline-block";
        p.style.fontSize = this.fontSize + "px";
        p.style.width = "inherit";
        p.style.wordWrap = "break-word";
        p.style.fontFamily = this.font;

        p.style.textDecoration = this.underline ? "underline" : "";
        p.style.fontWeight = this.bold ? "bold" : "";
        p.style.fontStyle = this.italic ? "italic" : "";
      } else p.textContent += this.activeElement.value[i];
    }

    d.style.height = "fit-content";

    document.getElementById("body")?.appendChild(d);
    this.elements.push(d);

    this.activeElement.style.display = "none";
    this.activeElement = null;

    properties.isTyping = false;
  }

  // ~~~ PROPERTIES ~~~ \\
  updateFontSize(isGoingUp?: boolean) {
    if (!isGoingUp && this.fontSize === 1) return;

    const sizeElement = document.getElementById(
      "font-size"
    )! as HTMLInputElement;

    if (this.fontSize === parseInt(sizeElement.value)) {
      if (isGoingUp) this.fontSize += 1;
      else this.fontSize -= 1;

      sizeElement.value = this.fontSize.toString();
    } else this.fontSize = parseInt(sizeElement.value);

    if (this.activeElement)
      this.activeElement.style.fontSize = this.fontSize + "px";

    // Change properties when selected
    if (this.tool === "cursor") {
      for (const child of this.clickedElement.children) {
        child.style.fontSize = this.fontSize + "px";
      }
    }
  }

  updateFont(e: HTMLElement) {
    // Changing the value element
    // e.textContent = ;

    // Update the value
    this.font = e.firstChild!.textContent!;
    if (this.activeElement) {
      this.activeElement.style.fontFamily = this.font;
    }

    document.getElementById("font-value")!.textContent = this.font;

    // Change if you have the item selected
    if (this.tool === "cursor") {
      for (const child of this.clickedElement.children) {
        child.style.fontFamily = this.font;
      }
    }
  }

  setFontStyle(e: HTMLElement) {
    // Change properties if text selected
    if (this.tool === "cursor") {
      for (const child of this.clickedElement.children) {
        if (e.id === "underline") {
          child.style.textDecoration =
            child.style.textDecoration === "underline" ? "" : "underline";
        }
        if (e.id === "bold") {
          child.style.fontWeight =
            child.style.fontWeight === "bold" ? "" : "bold";
        }
        if (e.id === "italic") {
          child.style.fontStyle =
            child.style.fontStyle === "italic" ? "" : "italic";
        }
      }
    } else {
      if (e.id === "underline") this.underline = !this.underline;
      if (e.id === "bold") this.bold = !this.bold;
      if (e.id === "italic") this.italic = !this.italic;

      if (!this.activeElement) return;
      this.activeElement.style.textDecoration = this.underline
        ? "underline"
        : "";
      this.activeElement.style.fontWeight = this.bold ? "bold" : "";
      this.activeElement.style.fontStyle = this.italic ? "italic" : "";
    }
  }

  handleDeleteHover(e: HTMLElement) {
    if (!this.clickedElement) return;

    e.style.cursor = "pointer";
    e.style.color = "red";
  }

  handleDeleteMouseUp(e: HTMLElement) {
    e.style.color = "white";
    e.style.cursor = "default";
  }

  handleMouseDown(e: MouseEvent) {
    // Check if the mouse was clicked on the canvas
    if (
      e.x < properties.leftPaneSize ||
      e.x > window.innerWidth - properties.rightPaneSize ||
      e.y < properties.topPaneSize ||
      e.y > window.innerHeight - properties.topPaneSize
    )
      return;

    // @ts-ignore
    if (e.target.parentNode === document.getElementById("font-options")) return;

    if (this.clickedElement) {
      if (this.clickedElement.children[0].nodeName === "P") {
        this.unselectItem();
      }
    }

    // Reset last clickedElement
    if (this.clickedElement) this.clickedElement.style.outline = "none";

    this.clickedElement = e.target;
    this.clickedElement = this.clickedElement.parentNode;
    this.mouseDown = true;
    if (this.tool === "cursor") {
      this.useTool();
    }

    if (this.clickedElement.children[0].nodeName === "P") {
      // if (document.getElementById(`${this.tool}-pane`)) {
      //   document.getElementById(`${this.tool}-pane`)!.style.display = "none";
      // } else document.getElementById("default-tool")!.style.display = "none";
      document.getElementById("text-pane")!.style.display = "flex";
    }

    if (e.target !== this.canvas) return;
    this.clickPos = { x: e.offsetX, y: e.offsetY };
  }

  unselectItem() {
    if (document.getElementById("text-pane")!.style.display === "flex") {
      document.getElementById("text-pane")!.style.display = "none";
    }

    this.clickedElement.style.outline = "";
    this.clickedElement = null;
  }

  handleMouseUp(e: MouseEvent) {
    this.changingFontSize = false;
    this.mouseDown = false;
    this.drawBlankCanvas();

    // if (this.clickedElement) {
    //   this.clickedElement.style.outline = "";
    //   this.clickedElement = null;
    // }

    if (e.target !== this.canvas) return;
    this.unclickPos = { x: e.offsetX, y: e.offsetY };
    if (this.clickPos === null) return;

    this.useTool();
  }

  handleMouseMove(e: MouseEvent) {
    if (this.changingFontSize) {
      this.updateFontSize(properties.mousePos.x > properties.prevMouse.x);
    }

    this.mousePos = { x: e.x, y: e.y };
    if (this.tool === "cursor" && this.mouseDown) this.handleCursorTool();

    this.strokeRect(e);

    if (this.mouseDown && this.movingTextBox) this.handleMoveTextBox();

    this.prevMouse = { x: e.x, y: e.y };
    if (e.target !== this.canvas) return;
  }

  handleResize() {
    this.setWidthAndHeight();
  }
}
