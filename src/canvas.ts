class Canvas {
  width: number;
  height: number;
  layers: Layer[];
  activeLayer: number;
  brush: string;
  brushSize: number;
  mouseDown: boolean;
  x: number;
  y: number;
  prevX: number | null;
  prevY: number | null;
  history: any;

  constructor() {
    this.width =
      window.innerWidth -
      properties.rightPaneSize -
      properties.leftPaneSize -
      25;
    this.height = window.innerHeight - properties.topPaneSize - 25;

    this.layers = [];
    this.activeLayer = -1;
    this.brush = "pencil";
    this.brushSize = 20;
    this.mouseDown = false;
    this.x = 0;
    this.y = 0;
    this.prevX = null;
    this.prevY = null;
    this.history = [];
  }

  pushHistory() {}

  popHistory() {}

  updateThickness(isIncreasing: boolean) {
    if (this.brushSize === 1 && !isIncreasing) return;

    this.brushSize += isIncreasing ? 1 : -1;
    document.getElementById("thickness-value")!.textContent =
      this.brushSize.toString();

    cursorLayer.handleMouseMove();
  }

  handleResize(e: any) {
    this.width =
      window.innerWidth -
      properties.rightPaneSize -
      properties.leftPaneSize -
      25;

    this.height = window.innerHeight - properties.topPaneSize - 25;

    // Resize all of the layers
    // TODO
  }

  handleMouseDown(e: MouseEvent) {
    // Make sure you are clicking on one of the layers
    for (const layer of this.layers) {
      if (e.target === layer.canv) {
        this.mouseDown = true;
        this.x = e.offsetX;
        this.y = e.offsetY;

        this.handleDraw();
        this.update();
      }
    }
  }

  handleMouseUp(e: MouseEvent) {
    this.mouseDown = false;
  }

  handleMouseMove(e: MouseEvent) {
    this.x = e.offsetX;
    this.y = e.offsetY;
    this.handleDraw();
    this.fillInGaps();
    this.update();

    this.prevX = e.offsetX;
    this.prevY = e.offsetY;
  }

  update() {
    for (const layer of this.layers) {
      layer.handleChanges();
    }
  }

  fillInGaps() {
    // This is to help fill in when the mouse is moved too quickly
    if (this.prevX === this.x && this.prevY === this.y) return;
    if (!this.mouseDown) return;

    let xDifference = this.x - this.prevX!;
    let yDifference = this.y - this.prevY!;
    let distance = Math.sqrt(
      xDifference * xDifference + yDifference * yDifference
    );

    for (let i = 0; i < distance; i++) {
      let x = (i / distance) * xDifference;
      let y = (i / distance) * yDifference;

      this.handleDraw(Math.floor(this.x + x), Math.floor(this.y + y));
    }

    return;
    for (let i = 0; i < this.prevX! - this.x; i++) {
      this.handleDraw(this.prevX! + i, this.y);
    }
    for (let i = 0; i < this.prevY! - this.y; i++) {
      this.handleDraw(this.x, this.y + i);
    }
    for (let i = 0; i < this.prevX! - this.x; i++) {
      this.handleDraw(this.prevX! + i, this.y);
    }
    for (let i = 0; i < this.prevX! - this.x; i++) {
      this.handleDraw(this.prevX! + i, this.y);
    }
  }

  handleDraw(xPos?: number, yPos?: number) {
    if (!this.mouseDown) return;
    if (this.brush === "pencil") {
      let x = xPos ?? this.x;
      let y = yPos ?? this.y;
      let offset = this.brushSize / 2;

      for (let i = x - offset; i < x + offset; i++) {
        for (let j = y - offset; j < y + offset; j++) {
          if (i < 0 || i >= this.width || j < 0 || j >= this.height) continue;

          let dat =
            this.layers[this.activeLayer].data[Math.floor(i)][Math.floor(j)];
          if (
            dat.r === colorWheel.r &&
            dat.g === colorWheel.g &&
            dat.b === colorWheel.b
          )
            continue;

          this.layers[this.activeLayer].changes.push({
            r: colorWheel.r,
            g: colorWheel.g,
            b: colorWheel.b,
            a: 1,
            x: i,
            y: j,
          });
        }
      }
    }
  }

  createNewLayer(isCursor = false) {
    this.layers.push(
      new Layer(
        this.width,
        this.height,
        `Layer ${this.layers.length}`,
        this.layers.length,
        isCursor
      )
    );
    if (!isCursor) this.activeLayer++;

    return this.layers[this.layers.length - 1];
  }
}
