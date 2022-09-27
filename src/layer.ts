class Layer {
  height: number;
  width: number;
  name: string;
  order: number;
  canv: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  changes: changeType[];
  data: any;
  constructor(width: number, height: number, name: string, order: number) {
    // Initialize variables
    this.width = width;
    this.height = height;
    this.name = name;
    this.order = order + 1;
    this.canv = document.createElement("canvas");
    this.ctx = this.canv!.getContext("2d")!;

    this.changes = [];
    this.data = this.initData();

    this.makeLayer();
  }

  initData() {
    let d: any = [];
    for (let i = 0; i < this.width; i++) {
      d.push([]);
      for (let j = 0; j < this.height; j++) {
        d[i][j] = { r: 255, g: 255, b: 255 };
      }
    }
    return d;
  }

  // Handle all of the inline styling
  makeLayer() {
    // Sizing
    this.canv!.width = this.width;
    this.canv!.height = this.height;

    // Positioning
    this.canv.style.position = "absolute";
    this.canv!.style.zIndex = this.order.toString();

    this.canv.style.top =
      properties.topPaneSize + properties.offset + 12 + "px";

    this.canv.style.left =
      properties.leftPaneSize + properties.offset + 10 + "px";

    // Append
    document.getElementById("canvas-wrapper")!.appendChild(this.canv);

    // Make dom elements for layer tab
    let d = document.createElement("div");
    let s = document.createElement("span");
    let i = document.createElement("input");

    // Set properties of span (layer thumbnail)
    s.className = "layer-preview";

    // Set properties of input (layer name)
    i.className = "layer-name";
    i.value = this.name;

    // Set properties of div (Wrapper)
    d.id = this.order.toString();

    // Append to the div wrapper
    d.className = "layer";
    d.appendChild(s);
    d.appendChild(i);

    // Append to the layer wrapper
    document.getElementById("layer-wrapper")?.appendChild(d);
  }

  handleChanges() {
    if (!this.changes.length) return;

    // console.log(this.changes); // Temp
    for (const change of this.changes) {
      let { r, g, b, a, x, y } = change;
      if (x < 0 || x >= this.width || y < 0 || y >= this.height) continue;
      if (
        this.data[Math.floor(x)][Math.floor(y)].r === r &&
        this.data[Math.floor(x)][Math.floor(y)].g === g &&
        this.data[Math.floor(x)][Math.floor(y)] === b
      )
        continue;

      this.data[Math.floor(x)][Math.floor(y)].r = r;
      this.data[Math.floor(x)][Math.floor(y)].g = g;
      this.data[Math.floor(x)][Math.floor(y)].b = b;

      let newCol = "rgb(" + r + "," + g + "," + b + ")";

      this.ctx!.fillStyle = newCol;
      this.ctx!.fillRect(x, y, 1, 1);
    }

    this.changes = [];
  }

  hide() {
    this.canv!.style.display = "none";
  }

  show() {
    this.canv!.style.display = "block";
  }

  render() {
    return;
  }
}
