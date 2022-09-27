"use strict";
class Layer {
    constructor(width, height, name, order) {
        // Initialize variables
        this.width = width;
        this.height = height;
        this.name = name;
        this.order = order + 1;
        this.canv = document.createElement("canvas");
        this.ctx = this.canv.getContext("2d");
        this.changes = [{ r: 0, g: 0, b: 0, a: 0, x: -1, y: -1 }];
        this.makeLayer();
    }
    // Handle all of the inline styling
    makeLayer() {
        var _a;
        // Sizing
        this.canv.width = this.width;
        this.canv.height = this.height;
        // Positioning
        this.canv.style.position = "absolute";
        this.canv.style.zIndex = this.order.toString();
        this.canv.style.top =
            properties.topPaneSize + properties.offset + 12 + "px";
        this.canv.style.left =
            properties.leftPaneSize + properties.offset + 10 + "px";
        // Append
        document.getElementById("canvas-wrapper").appendChild(this.canv);
        // Make dom elements for layer tab
        let d = document.createElement("div");
        let s = document.createElement("span");
        let i = document.createElement("input");
        // Set properties of span (layer thumbnail)
        s.className = "layer-preview";
        // Set properties of input (layer name)
        i.className = "layer-name";
        i.value = this.name;
        // Append to the div wrapper
        d.className = "layer";
        d.appendChild(s);
        d.appendChild(i);
        // Append to the layer wrapper
        (_a = document.getElementById("layer-wrapper")) === null || _a === void 0 ? void 0 : _a.appendChild(d);
    }
    handleChanges() {
        if (this.changes.length === 1)
            return;
        // console.log(this.changes); // Temp
        for (const change of this.changes) {
            let { r, g, b, a, x, y } = change;
            let newCol = "rgb(" + r + "," + g + "," + b + ")";
            this.ctx.fillStyle = newCol;
            this.ctx.fillRect(x, y, 1, 1);
        }
        this.changes = [{ r: 0, g: 0, b: 0, a: 0, x: -1, y: -1 }];
    }
    hide() {
        this.canv.style.display = "none";
    }
    show() {
        this.canv.style.display = "block";
    }
    render() {
        return;
    }
}
