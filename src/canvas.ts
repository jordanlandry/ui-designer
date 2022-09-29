const defaultCanv = {
  tool: "cursor",
  clickPos: null,
  unclickPos: null,
  mousePos: null,
  prevMouse: null,
  width: window.innerWidth - 75 - 150,
  height: window.innerHeight - 75 - 2,
  elements: [],
  mouseDown: false,
  clickedElement: null,
  fontSize: 12,
  activeElement: null,
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

    this.activeElement = null;

    // Canvas properties
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d")!;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas.style.position = "absolute";
    this.canvas.style.top = "75px";
    this.canvas.style.left = "75px";
    this.canvas.style.border = "1px solid black";
    document.getElementById("body")?.appendChild(this.canvas);
  }

  setTool(e: HTMLElement) {
    document.getElementById(this.tool)!.className = "tool";
    document.getElementById(e.id)!.className += " active";
    this.tool = e.id;
  }

  useTool() {
    if (this.tool === "text") {
      properties.isTyping = true;

      if (this.activeElement) {
        this.activeElement.style.display = "none";
        this.activeElement = null;
      }

      let t = document.createElement("textarea");
      t.style.position = "absolute";
      t.style.left = `${this.clickPos?.x! + 75}px`;
      t.style.top = `${this.clickPos?.y! + 75}px`;
      t.style.fontSize = this.fontSize + "px";
      t.style.margin = "0";
      t.style.padding = "0";

      t.style.width = this.unclickPos!.x - this.clickPos!.x + "px";
      t.style.height = this.unclickPos!.y - this.clickPos!.y + "px";
      t.style.backgroundColor = "transparent";

      document.getElementById("body")?.appendChild(t);
      this.activeElement = t;
    }

    if (this.tool === "cursor") this.handleCursorTool();
  }

  handleCursorTool() {
    if (!this.mouseDown) return;
    for (const el of unclickableElements) {
      if (this.clickedElement === el) return;
    }

    let left = parseInt(this.clickedElement.style.left.replaceAll("px", ""));
    let top = parseInt(this.clickedElement.style.top.replaceAll("px", ""));

    if (this.prevMouse) {
      left += this.mousePos!.x - this.prevMouse!.x;
      top += this.mousePos!.y - this.prevMouse!.y;
    }

    this.clickedElement.style.border = "1px solid black";
    this.clickedElement.style.left = left + "px";
    this.clickedElement.style.top = top + "px";
  }

  finishElement() {
    // Create a wrapper for the text element
    let d = document.createElement("div");
    d.style.position = "absolute";
    d.style.left = `${this.clickPos?.x! + 75}px`;
    d.style.top = `${this.clickPos?.y! + 75}px`;
    d.style.width = this.activeElement.style.width;
    d.style.height = this.unclickPos!.y - this.clickPos!.y + "px";
    d.style.margin = "0";

    let l = this.activeElement.value.length;
    let p = document.createElement("p");
    p.style.margin = "0";
    p.style.fontSize = this.fontSize + "px";
    p.style.display = "inline-block";

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
      } else p.textContent += this.activeElement.value[i];
    }

    d.style.height = "fit-content";

    document.getElementById("body")?.appendChild(d);
    this.elements.push(d);

    this.activeElement.style.display = "none";
    this.activeElement = null;

    properties.isTyping = false;
  }

  updateFontSize(e: HTMLInputElement) {
    this.fontSize = parseInt(e.value);
    this.activeElement.style.fontSize = this.fontSize + "px";
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
    this.mouseDown = false;
    if (this.clickedElement) {
      this.clickedElement.style.border = "";
      this.clickedElement = null;
    }

    if (e.target !== this.canvas) return;
    this.unclickPos = { x: e.offsetX, y: e.offsetY };
    if (this.clickPos === null) return;

    this.useTool();
  }

  handleMouseMove(e: MouseEvent) {
    this.mousePos = { x: e.x, y: e.y };
    if (this.tool === "cursor" && this.mouseDown) this.handleCursorTool();
    this.prevMouse = { x: e.x, y: e.y };
    if (e.target !== this.canvas) return;
  }
}
