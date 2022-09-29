class Canvas {
  tool: string;
  clickPos: { x: number; y: number } | null;
  unclickPos: { x: number; y: number } | null;
  mousePos: { x: number; y: number } | null;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  activeElement: any;
  elements: any;
  mouseDown: boolean;
  clickedElement: any;

  constructor() {
    // Default values
    this.tool = "cursor";
    this.clickPos = null;
    this.unclickPos = null;
    this.mousePos = null;
    this.width = window.innerWidth - 75 - 150;
    this.height = window.innerHeight - 75 - 2;
    this.elements = [];
    this.mouseDown = false;
    this.clickedElement = null;

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
      if (this.activeElement) {
        this.activeElement.style.display = "none";
        this.activeElement = null;
      }

      let t = document.createElement("textarea");
      t.style.position = "absolute";
      t.style.left = `${this.clickPos?.x! + 75}px`;
      t.style.top = `${this.clickPos?.y! + 75}px`;
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
    if (!this.mouseDown || this.clickedElement === this.canvas) return;
    this.clickedElement.style.border = "1px solid black";
    this.clickedElement.style.left = this.mousePos!.x + "px";
    this.clickedElement.style.top = this.mousePos!.y + "px";
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

    // Check for new lines
    for (let i = 0; i < l; i++) {
      if (this.activeElement.value[i] === "\n" || i === l - 1) {
        if (i === l - 1) p.textContent += this.activeElement.value[i];
        else d.append(document.createElement("br"));
        d.appendChild(p);
        p = document.createElement("p");
        p.style.margin = "0";
      } else p.textContent += this.activeElement.value[i];
    }
    d.style.height = "fit-content";

    document.getElementById("body")?.appendChild(d);
    this.elements.push(d);

    this.activeElement.style.display = "none";
    this.activeElement = null;
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

    if (e.target !== this.canvas) return;
  }
}
