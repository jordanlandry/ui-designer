class Canvas {
  tool: string;
  clickPos: { x: number; y: number } | null;
  unclickPos: { x: number; y: number } | null;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;

  activeElement: any;

  constructor() {
    // Default values
    this.tool = "text";
    this.clickPos = null;
    this.unclickPos = null;
    this.width = 500;
    this.height = 500;

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

      t.style.width = this.unclickPos!.x - this.clickPos!.x + "px";
      t.style.height = this.unclickPos!.y - this.clickPos!.y + "px";
      t.style.backgroundColor = "transparent";

      document.getElementById("body")?.appendChild(t);
      this.activeElement = t;
    }
  }

  finishElement() {
    let p = document.createElement("p");
    p.textContent = this.activeElement.value;
    p.style.position = "absolute";
    p.style.left = `${this.clickPos?.x! + 75}px`;
    p.style.top = `${this.clickPos?.y! + 75}px`;
    p.style.width = this.unclickPos!.x - this.clickPos!.x + "px";
    p.style.height = this.unclickPos!.y - this.clickPos!.y + "px";
    p.style.margin = "0";

    document.getElementById("body")?.appendChild(p);

    this.activeElement.style.display = "none";
    this.activeElement = null;
  }

  handleMouseDown(e: MouseEvent) {
    if (e.target !== this.canvas) return;
    this.clickPos = { x: e.offsetX, y: e.offsetY };
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
