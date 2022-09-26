class ColorWheel {
  color: string;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
  r: number;
  g: number;
  b: number;
  x: number;
  y: number;
  huePosition: number;
  colorX: number;
  colorY: number;

  changingHue: boolean;
  setColor: (c: string) => void;
  mouseDown: boolean;
  constructor(properties: any, setColor: (c: string) => void) {
    this.color = "white";
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.r = 0;
    this.g = 0;
    this.b = 0;

    this.setColor = setColor;
    this.mouseDown = false;

    this.x = 0;
    this.y = 0;

    this.changingHue = false;
    this.huePosition = 0;
    this.colorX = 0;
    this.colorY = 0;
    this.init();
    this.hide();
  }

  init() {
    this.canvas.width = 255;
    this.canvas.height = 255 + 32;
    this.canvas.style.position = "fixed";
    this.canvas.style.top = `${300}px`;
    this.canvas.style.left = "36px";
    this.canvas.style.zIndex = "100";
    this.canvas.style.border = "1px solid black";

    this.ctx!.fillStyle = properties.color;
    // this.ctx?.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.draw();
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    document.addEventListener("mousemove", this.handleMouseMove);
    document.addEventListener("mouseup", this.handleMouseUp);

    document.body.appendChild(this.canvas);
  }

  draw() {
    for (let i = 0; i < 255; i++) {
      let grd = this.ctx!.createLinearGradient(0, 0, this.canvas.width, 0);
      grd.addColorStop(0, `rgb(${255 - i} ${255 - i} ${255 - i})`);
      grd.addColorStop(1, `rgb(${this.r - i} ${this.g - i} ${this.b - i})`);

      this.ctx!.fillStyle = grd;
      this.ctx!.fillRect(0, i, this.canvas.width, 1);
    }

    // Creating the hues
    let grd = this.ctx!.createLinearGradient(0, 0, this.canvas.width, 0);
    grd.addColorStop(0, "rgb(255, 0, 0)");
    grd.addColorStop(1 / 6, "rgb(255, 255, 0)");
    grd.addColorStop(2 / 6, "rgb(0, 255, 0)");
    grd.addColorStop(3 / 6, "rgb(0, 255, 255)");
    grd.addColorStop(4 / 6, "rgb(0, 0, 255)");
    grd.addColorStop(5 / 6, "rgb(255, 0, 255)");
    grd.addColorStop(6 / 6, "rgb(255, 0, 0)");
    this.ctx!.fillStyle = grd;
    this.ctx!.fillRect(0, 255, 255, this.canvas.height - 255);

    // Drawing the hue slider
    this.ctx!.fillStyle = "white";
    this.ctx!.strokeStyle = "white";
    this.ctx!.lineWidth = 2;
    this.ctx?.strokeRect(this.huePosition, 256, 6, this.canvas.height - 257);

    // Drawing the color selector circle
    this.ctx!.lineWidth = 1;
    this.ctx!.strokeStyle = "white";
    this.ctx!.beginPath();
    this.ctx!.arc(
      clamp(this.colorX, 0, 255),
      clamp(this.colorY, 0, 255),
      5,
      0,
      2 * Math.PI
    );
    this.ctx!.stroke();
  }

  handleMouseDown(e: MouseEvent) {
    // Use the same code that handleMouseMove uses to avoid "copy paste" code
    colorWheel.mouseDown = true;

    colorWheel.changingHue = e.offsetX > 255 || e.offsetY > 255;
    colorWheel.handleMouseMove(e);
  }

  handleMouseMove(e: MouseEvent) {
    if (!colorWheel.mouseDown) return;
    if (!colorWheel.changingHue) {
      colorWheel.colorX = e.offsetX;
      colorWheel.colorY = e.offsetY;
      colorWheel.handleColorChange(e.offsetX, e.offsetY);
    } else {
      colorWheel.huePosition = clamp(e.offsetX, 0, 255);
      colorWheel.handleHueChange(colorWheel.huePosition);
    }
    colorWheel.draw();
  }

  handleMouseUp(e: MouseEvent) {
    colorWheel.mouseDown = false;
    return;
    if (!colorWheel.changingHue) colorWheel.hide(); // Don't hide if you just change hue
  }

  handleColorChange(x: number, y: number) {
    let r;
    let g;
    let b;
    // this.setColor(`rgb(${this.r - x}, ${this.g - x - y}, ${this.b - x - y})`);
  }

  handleHueChange = (x: number) => {
    // 255, 0, 0 ->
    // 255, 255, 0 ->
    // 0, 255, 0 ->
    // 0, 255, 255 ->
    // 0, 0, 255 ->
    // 255, 0, 255 ->
    // 255, 0, 0

    // I need to normalize the values by how far it's scrolled,
    // this will give me a percentage of how complete the step is
    // I can then multiply that by 255 to get the correct values

    let stepCount = 6;
    let step = (x / 255) * stepCount;

    if (step < 1) {
      this.r = 255; // Constant
      this.g = step * 255;
    } else if (step < 2) {
      this.r = 255 - (step - 1) * 255;
      this.g = 255; // Constant
      this.b = 0; // Constant
    } else if (step < 3) {
      this.r = 0; // Constant
      this.g = 255; // Constant
      this.b = (step - 2) * 255;
    } else if (step < 4) {
      this.r = 0; // Constant
      this.g = 255 - (step - 3) * 255;
      this.b = 255; // Constant
    } else if (step < 5) {
      this.r = (step - 4) * 255;
      this.g = 0; // Constant
      this.b = 255; // Constant
    } else if (step < 6) {
      this.r = 255; //
      this.g = 0;
      this.b = 255 - (step - 5) * 255;
    }
    this.setColor(`rgb(${this.r}, ${this.g}, ${this.b})`);
  };

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
