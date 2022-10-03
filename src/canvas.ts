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
    const s = document.getElementById("font")! as HTMLSelectElement;
    s.value = this.font;

    const i = document.getElementById("font-size") as HTMLInputElement;
    i.value = this.fontSize + "";

    document.getElementById("color-selector")!.style.backgroundColor =
      this.color;
  }

  setTool(e: HTMLElement) {
    if (this.tool === "text") this.finishElement();

    document.getElementById(this.tool)!.className = "tool";
    document.getElementById(e.id)!.className += " active";
    this.tool = e.id;
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
    if (this.clickedElement === null) return;
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
  }

  updateFont(e: HTMLSelectElement) {
    this.font = e.value;

    if (this.activeElement) {
      this.activeElement.style.fontFamily = this.font;
    }
  }

  setFontStyle(e: HTMLElement) {
    if (e.id === "underline") this.underline = !this.underline;
    if (e.id === "bold") this.bold = !this.bold;
    if (e.id === "italic") this.italic = !this.italic;

    if (!this.activeElement) return;
    this.activeElement.style.textDecoration = this.underline ? "underline" : "";
    this.activeElement.style.fontWeight = this.bold ? "bold" : "";
    this.activeElement.style.fontStyle = this.italic ? "italic" : "";
  }

  handleMouseDown(e: MouseEvent) {
    this.clickedElement = e.target;
    this.clickedElement = this.clickedElement.parentNode;
    this.mouseDown = true;
    if (this.tool === "cursor") this.useTool();

    if (e.target !== this.canvas) return;
    this.clickPos = { x: e.offsetX, y: e.offsetY };
  }

  handleMouseUp(e: MouseEvent) {
    this.changingFontSize = false;
    this.mouseDown = false;
    this.drawBlankCanvas();

    if (this.clickedElement) {
      this.clickedElement.style.outline = "";
      this.clickedElement = null;
    }

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
