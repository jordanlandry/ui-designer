"use strict";
class Canvas {
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
        this.history = [];
    }
    pushHistory() { }
    popHistory() { }
    updateThickness(isIncreasing) {
        if (this.brushSize === 1 && !isIncreasing)
            return;
        this.brushSize += isIncreasing ? 1 : -1;
        document.getElementById("thickness-value").textContent =
            this.brushSize.toString();
        cursorLayer.handleMouseMove();
    }
    handleResize(e) {
        this.width =
            window.innerWidth -
                properties.rightPaneSize -
                properties.leftPaneSize -
                25;
        this.height = window.innerHeight - properties.topPaneSize - 25;
        // Resize all of the layers
        // TODO
    }
    handleMouseDown(e) {
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
    handleMouseUp(e) {
        this.mouseDown = false;
    }
    handleMouseMove(e) {
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
        if (!this.mouseDown)
            return;
        if (this.brush === "pencil") {
            let offset = this.brushSize / 2;
            for (let i = this.x - offset; i < this.x + offset; i++) {
                for (let j = this.y - offset; j < this.y + offset; j++) {
                    if (i < 0 || i >= this.width || j < 0 || j >= this.height)
                        continue;
                    let dat = this.layers[this.activeLayer].data[Math.floor(i)][Math.floor(j)];
                    if (dat.r === colorWheel.r &&
                        dat.g === colorWheel.g &&
                        dat.b === colorWheel.b)
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
        this.layers.push(new Layer(this.width, this.height, `Layer ${this.layers.length}`, this.layers.length, isCursor));
        if (!isCursor)
            this.activeLayer++;
        return this.layers[this.layers.length - 1];
    }
}
