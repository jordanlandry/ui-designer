class Canvas {
  tool: string;
  clickPos: { x: number; y: number } | null;
  unclickPos: { x: number; y: number } | null;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  activeElement: any;
  elements: any;

  constructor() {
    // Default values
    this.tool = "text";
    this.clickPos = null;
    this.unclickPos = null;
    this.width = window.innerWidth - 75 - 150;
    this.height = window.innerHeight - 75 - 2;
    this.elements = [];

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

    if (this.tool === "cursor") {
    }
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

    // // let p = document.createElement("p");
    // p.textContent = this.activeElement.value;
    // p.style.position = "absolute";
    // p.style.left = `${this.clickPos?.x! + 75}px`;
    // p.style.top = `${this.clickPos?.y! + 75}px`;
    // p.style.width = this.unclickPos!.x - this.clickPos!.x + "px";
    // p.style.height = this.unclickPos!.y - this.clickPos!.y + "px";
    // p.style.margin = "0";

    document.getElementById("body")?.appendChild(d);
    this.elements.push(d);

    this.activeElement.style.display = "none";
    this.activeElement = null;
  }

  handleMouseDown(e: MouseEvent) {
    if (e.target !== this.canvas) return;
    this.clickPos = { x: e.offsetX, y: e.offsetY };

    if (this.tool === "cursor") this.useTool();
  }

  handleMouseUp(e: MouseEvent) {
    if (e.target !== this.canvas) return;

    this.unclickPos = { x: e.offsetX, y: e.offsetY };
    if (this.clickPos === null) return;

    this.useTool();
  }

  handleMouseMove(e: MouseEvent) {
    if (e.target !== this.canvas) return;
  }
}
