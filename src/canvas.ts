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
    this.brushSize = 10;
    this.mouseDown = false;
    this.x = 0;
    this.y = 0;
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
    this.update();
  }

  update() {
    for (const layer of this.layers) {
      layer.handleChanges();
    }
  }

  handleDraw() {
    if (!this.mouseDown) return;
    if (this.brush === "pencil") {
      let offset = this.brushSize / 2;

      for (let i = this.x - offset; i < this.x + offset; i++) {
        for (let j = this.y - offset; j < this.y + offset; j++) {
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

  createNewLayer() {
    this.layers.push(
      new Layer(
        this.width,
        this.height,
        `Layer ${this.layers.length}`,
        this.layers.length
      )
    );
    this.activeLayer++;
  }
}
