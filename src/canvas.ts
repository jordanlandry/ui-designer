class Canvas {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  height: number;
  width: number;
  brush: string;
  x: number;
  y: number;
  moveX: number;
  moveY: number;
  totalX: number;
  totalY: number;
  clickX: number;
  clickY: number;
  mouseDown: boolean;
  fontSize: number;
  textElement: any;
  layers: layer[];
  constructor() {
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d")!;
    this.width =
      window.innerWidth -
      properties.leftPaneSize -
      properties.rightPaneSize -
      properties.padding * 2 -
      properties.offset;
    this.height = window.innerHeight - properties.topPaneSize;

    this.brush = "square";
    this.x = 0;
    this.y = 0;
    this.moveX = 0;
    this.moveY = 0;
    this.clickX = 0;
    this.clickY = 0;
    this.fontSize = 25;
    this.mouseDown = false;
    this.totalX = 0;
    this.totalY = 0;
    this.textElement = false;

    this.layers = [];

    this.fillBlank();
    this.init();
  }

  init() {
    this.canvas!.width = this.width;
    this.canvas!.height = this.height;

    this.canvas!.addEventListener("mousedown", this.handleMouseDown);

    document.addEventListener("mousemove", this.handleMouseMove);
    document.addEventListener("mouseup", this.handleMouseUp);
    window.addEventListener("resize", this.handleSetSize);
  }

  handleMouseDown(e: MouseEvent) {
    if (e.button !== 0) return;

    canv.mouseDown = true;

    // Set the click positions
    canv.clickX = e.offsetX;
    canv.clickY = e.offsetY;
    canv.x = e.offsetX;
    canv.y = e.offsetY;
    canv.totalX = e.x;
    canv.totalY = e.y;

    if (colorWheel.isShowing) colorWheel.hide();
    else canv.draw(true);
  }

  handleMouseMove(e: MouseEvent) {
    canv.moveX = e.offsetX;
    canv.moveY = e.offsetY;
    canv.drawCursor(canv.moveX, canv.moveY, e);

    if (!canv.mouseDown) return; // Don't run if the mouse isn't being clicked

    canv.x = e.offsetX;
    canv.y = e.offsetY;
    canv.draw();
  }

  handleMouseUp(e: MouseEvent) {
    canv.mouseDown = false;
  }

  createNewLayer() {
    let data: [pixel[]] = [[]];
    for (let i = 0; i < this.width; i++) {
      data.push([]);
      for (let j = 0; j < this.height; j++) {
        data[i].push({ r: 0, g: 0, b: 0, a: 1 });
      }
    }

    let newLayer: layer = {
      name: "Layer " + this.layers.length,
      id: "l" + this.layers.length,
      isVisible: true,
      pos: this.layers.length,
      data: data!,
    };

    this.layers.push(newLayer);

    // Creating the DOM element
    let d = document.createElement("div");
    d.className = "layer";

    let s1 = document.createElement("span");
    s1.className = "layer-preview";
    s1.id = newLayer.id;
    s1.onclick = () => setActiveLayer(newLayer.id);

    let s2 = document.createElement("span");
    s2.onclick = () => this.handleRenameLayer(0);
    s2.className = "layer-name";
    s2.id = newLayer.id + "-name";
    s2.textContent = newLayer.name;

    d.appendChild(s1);
    d.appendChild(s2);
    document.getElementById("layer-wrapper")?.appendChild(d);
    setActiveLayer(newLayer.id);
  }

  handleRenameLayer(i: number) {
    document.getElementById(this.layers[i].id + "-name")!.textContent = "Test";
    this.layers[i].name = "Test";
  }

  removeActiveLayer() {
    return;
  }

  fillBlank() {
    this.ctx!.fillStyle = properties.canvasColor;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  draw(mouseClick?: boolean) {
    if (properties.currentTool === "pencil") this.handlePencil();
    else if (properties.currentTool === "eraser") this.handleEraser();
    else if (properties.currentTool === "bucket") this.handleBucket();
    else if (properties.currentTool === "line") this.handleLine();
  }

  drawCursor(x: number, y: number, e?: MouseEvent) {
    // Temp code
    this.ctx.fillStyle = properties.canvasColor;
    this.ctx.fillRect(0, 0, this.width, this.height);

    if (e && e.target !== document.getElementById("canvas")) return;

    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = 1;
    if (this.brush === "square") {
      this.ctx!.strokeRect(
        x - properties.thickness / 2,
        y - properties.thickness / 2,
        properties.thickness,
        properties.thickness
      );
    } else if (this.brush === "circle") {
      this.ctx!.beginPath();
      this.ctx!.arc(x, y, properties.thickness / 2, 0, 2 * Math.PI);
      this.ctx!.stroke();
    }
  }

  handlePencil() {
    this.ctx!.fillStyle = properties.color;

    // Handle Brushes
    if (this.brush === "square") {
      this.ctx!.fillRect(
        this.x - properties.thickness / 2,
        this.y - properties.thickness / 2,
        properties.thickness,
        properties.thickness
      );
    } else if (this.brush === "circle") {
      this.ctx!.beginPath();
      this.ctx!.arc(this.x, this.y, properties.thickness / 2, 0, 2 * Math.PI);
      this.ctx!.fill();
    }
  }

  handleEraser() {
    this.ctx!.fillStyle = properties.canvasColor;
    // Handle Brushes
    if (this.brush === "square") {
      this.ctx!.fillRect(
        this.x - properties.thickness / 2,
        this.y - properties.thickness / 2,
        properties.thickness,
        properties.thickness
      );
    } else if (this.brush === "circle") {
      this.ctx!.beginPath();
      this.ctx!.arc(this.x, this.y, properties.thickness / 2, 0, 2 * Math.PI);
      this.ctx!.fill();
    }
  }

  handleLine() {
    console.log("asd");
  }

  handleBucket() {
    this.ctx!.fillStyle = properties.color;
    this.ctx!.fillRect(0, 0, this.width, this.height);
  }

  setBrush(brush: string) {
    document.getElementById(this.brush)!.className = "brush";
    this.brush = brush;
    document.getElementById(brush)!.className += " active";
  }

  handleZoom(e: WheelEvent) {
    // Mouse wheel down
    if (e.deltaY > 0) {
      console.log("Zooming Out");
    } else {
      console.log("Zooming In");
    }
    return;
  }

  handleSlide(e: WheelEvent) {
    if (e.deltaY > 0) {
      console.log("Scrolling Left");
    } else {
      console.log("Scrolling Right");
    }
    return;
  }

  handleSetSize() {
    canv.width =
      window.innerWidth -
      properties.leftPaneSize -
      properties.rightPaneSize -
      properties.padding -
      properties.padding -
      properties.offset;
    canv.height = window.innerHeight;

    canv.canvas.width = canv.width;
    canv.canvas.height = canv.height;

    // Update the position of the colorwheel
    colorWheel.handleResize();
  }
}
