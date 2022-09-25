class ColorWheel {
  color: string;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
  r: number;
  g: number;
  b: number;
  x: number;
  y: number;
  setColor: (c: string) => void;
  mouseDown: boolean;
  constructor(properties: any, setColor: (c: string) => void) {
    this.color = "white";
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.init();
    this.hide();

    this.r = 0;
    this.g = 0;
    this.b = 0;

    this.setColor = setColor;
    this.mouseDown = false;

    this.x = 0;
    this.y = 0;
  }

  init() {
    this.canvas.width = 255;
    this.canvas.height = 255;
    this.canvas.style.position = "fixed";
    this.canvas.style.top = "274px";
    this.canvas.style.left = "8px";
    this.canvas.style.zIndex = "100";

    this.ctx!.fillStyle = properties.color;
    // this.ctx?.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.draw();
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    document.addEventListener("mouseup", this.handleMouseUp);

    document.body.appendChild(this.canvas);
  }

  draw() {
    for (let i = 0; i < this.canvas.height; i++) {
      let grd = this.ctx!.createLinearGradient(0, 0, this.canvas.width, 0);
      grd.addColorStop(0, `rgb(${255 - i} ${255 - i} ${255 - i})`);
      grd.addColorStop(1, `rgb(${255 - i} 0 0)`);

      this.ctx!.fillStyle = grd;
      this.ctx!.fillRect(0, i, this.canvas.width, 1);
    }
  }

  handleMouseDown(e: MouseEvent) {
    // Use the same code that handleMouseMove uses to avoid "copy paste" code
    colorWheel.mouseDown = true;
    colorWheel.handleMouseMove(e);
  }

  handleMouseMove(e: MouseEvent) {
    if (!colorWheel.mouseDown) return;

    // Draw circle
    colorWheel.draw();
    colorWheel.ctx!.strokeStyle = "white";
    colorWheel.ctx!.beginPath();
    colorWheel.ctx!.arc(e.offsetX, e.offsetY, 5, 0, 2 * Math.PI);
    colorWheel.ctx!.stroke();

    // Change the color state
    colorWheel.handleColorChange(e.offsetX, e.offsetY);
  }

  handleMouseUp(e: MouseEvent) {
    colorWheel.mouseDown = false;
    colorWheel.hide();
  }

  handleColorChange(x: number, y: number) {
    this.setColor(`rgb(${255 - y}, ${255 - x - y}, ${255 - x - y})`);

    console.log(255 - y, 0, 0);
  }

  toggleShown() {
    if (this.canvas.style.display === "block") this.hide();
    else if (this.canvas.style.display === "none") this.show();
  }

  show() {
    this.canvas.style.display = "block";
  }

  hide() {
    this.canvas.style.display = "none";
  }
}
