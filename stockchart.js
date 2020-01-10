class StockChartJs {
    constructor(canvas, config=null) {
        if(!(canvas instanceof HTMLCanvasElement)) {
                throw "Provided object is not a HTMLCanvasElement";
        }
        this.data = (config != null && "data" in config)?config["data"]:[];
        this.limit = (config != null && "limit" in config)?config["limit"]:20;
        this.reversed = (config != null && "reversed" in config)?config["reversed"]:false;
        this.scale = (config != null && "scale" in config)?config["scale"]:4;
        this.info = (config != null && "info" in config)?config["info"]:true;
        this.infoFont = (config != null && "info_font" in config)?config["info_font"]:"40px Arial";
        this.infoColor = (config != null && "info_color" in config)?config["info_color"]:"#333333";
        this.paddingTop = (config != null && "padding" in config && "top" in config["padding"])?config["padding"]["top"]:45;
        this.paddingBottom = (config != null && "padding" in config && "bottom" in config["padding"])?config["padding"]["bottom"]:35;
        this.paddingLeft = (config != null && "padding" in config && "left" in config["padding"])?config["padding"]["left"]:40;
        this.paddingRight = (config != null && "padding" in config && "right" in config["padding"])?config["padding"]["right"]:40;
        this.lineColor = (config != null && "series" in config && "color" in config["series"])?config["series"]["color"]:"#333333";
        this.lineWidth = (config != null && "series" in config && "width" in config["series"])?config["series"]["width"]:5;
        this.indexDots = (config != null && "index_dots" in config && "indexes" in config["index_dots"])?config["index_dots"]["indexes"]:[];
        this.indexDotRadius = (config != null && "index_dots" in config && "radius" in config["index_dots"])?config["index_dots"]["radius"]:10;
        this.indexDotColor = (config != null && "index_dots" in config && "color" in config["index_dots"])?config["index_dots"]["color"]:"#333333";
        this.indexDotBorder = (config != null && "index_dots" in config && "border" in config["index_dots"])?config["index_dots"]["border"]:0;
        this.indexDotBorderColor = (config != null && "index_dots" in config && "border_color" in config["index_dots"])?config["index_dots"]["border_color"]:"#000000";
        var rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * this.scale;
        canvas.height = rect.height * this.scale;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        // Draw fixed lines on buffer
        this.bufferCanvas = document.createElement('canvas');
        this.bufferCanvas.width = canvas.width;
        this.bufferCanvas.height = canvas.height;
        this.bufferCtx = this.bufferCanvas.getContext('2d');
        this.bufferCtx.clearRect(0, 0,  canvas.width, canvas.height);
        if(config != null && "x_lines" in config && "positions" in config["x_lines"]) {
            var scale = this.canvas.width - (this.paddingLeft + this.paddingRight),
                lines = config["x_lines"]["positions"],
                color = ("color" in config["x_lines"])?config["x_lines"]["color"]:"#aaaaaa",
                width = ("width" in config["x_lines"])?config["x_lines"]["width"]:3;
            this.bufferCtx.save();
            this.bufferCtx.lineWidth = width;
            this.bufferCtx.strokeStyle = color;
            for(var i=0; i<lines.length; i++) {
                this.bufferCtx.beginPath();
                this.bufferCtx.moveTo(this.paddingLeft + (lines[i] * scale) + (width / 2), this.paddingTop);
                this.bufferCtx.lineTo(this.paddingLeft + (lines[i] * scale) + (width / 2), this.canvas.height - this.paddingBottom);
                this.bufferCtx.stroke();
            }
            this.bufferCtx.restore();
        }
        if(config != null && "y_lines" in config && "positions" in config["y_lines"]) {
            var scale = this.canvas.height - (this.paddingTop + this.paddingBottom),
                lines = config["y_lines"]["positions"],
                color = ("color" in config["y_lines"])?config["y_lines"]["color"]:"#aaaaaa",
                width = ("width" in config["y_lines"])?config["y_lines"]["width"]:3;
            this.bufferCtx.save();
            this.bufferCtx.lineWidth = width;
            this.bufferCtx.strokeStyle = color;
            for(var i=0; i<lines.length; i++) {
                this.bufferCtx.beginPath();
                this.bufferCtx.moveTo(this.paddingLeft, this.paddingTop + (lines[i] * scale) + (width / 2));
                this.bufferCtx.lineTo(this.canvas.width - this.paddingRight, this.paddingTop + (lines[i] * scale) + (width / 2));
                this.bufferCtx.stroke();
            }
            this.bufferCtx.restore();
        }
    }
				
    push(point) {
        if(this.reversed) {
            this.data.unshift(point);
        } else {
            this.data.push(point);
        }
        while(this.data.length > this.limit) {
            if(this.reversed) {
                this.data.pop();
            } else {
                this.data.shift();
            }
        }
        this.update();
    }
    
    update() {
        var minValue = Infinity, maxValue = -Infinity, avgValue = 0;
        for(var i=0; i<this.data.length; i++) {
            if(this.data[i] > maxValue) {
                maxValue = this.data[i];
            }
            if(this.data[i] < minValue) {
                minValue = this.data[i];
            }
            avgValue += (1 / this.data.length) * this.data[i];
        }
        
        this.ctx.clearRect(0, 0,  this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.bufferCanvas, 0, 0);
        
        var minValueAbs = Math.abs(minValue),
            xScale = (this.canvas.width - (this.paddingLeft + this.paddingRight)) / (this.limit - 1), 
            yScale = (this.canvas.height - (this.paddingTop + this.paddingBottom)) / ((Math.abs(maxValue - minValue) > 1.0)?Math.abs(maxValue - minValue):1 + minValueAbs);
        
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.strokeStyle = this.lineColor;
        for(var i=0; i<this.data.length; i++) {
            var x = this.reversed?this.canvas.width - (this.paddingLeft + ((this.data.length - (i + 1)) * xScale)):this.paddingLeft + (i * xScale), 
							y = this.canvas.height - (this.paddingBottom + ((this.data[i] + minValueAbs) * yScale)) + (this.lineWidth / 2);
            if(i == 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        this.ctx.stroke();
        this.ctx.restore();
        
        this.ctx.save();
        for(var i=0; i<this.indexDots.length; i++) {
            if(i >= this.data.length) {
                break;
            }
            this.ctx.beginPath();
            this.ctx.arc(
				this.reversed?this.canvas.width - (this.paddingLeft + ((this.data.length - (i + 1)) * xScale)):this.paddingLeft + (this.indexDots[i] * xScale), 
				this.canvas.height - (this.paddingBottom + ((this.data[this.indexDots[i]] + minValueAbs) * yScale)) + (this.lineWidth / 2), 
				this.indexDotRadius, 0, 2 * Math.PI, false);
            this.ctx.fillStyle = this.indexDotColor;
            this.ctx.fill();
            if(this.indexDotBorder > 0) {
                this.ctx.lineWidth = this.indexDotBorder;
                this.ctx.strokeStyle = this.indexDotBorderColor;
                this.ctx.stroke();
            }
        }
        this.ctx.restore();
        
        if(this.info) {
            this.ctx.save();
            this.ctx.fillStyle = this.infoColor;
            this.ctx.font = this.infoFont;
            this.ctx.fillText("Min: " + minValue.toFixed(4) + ", Max: " + maxValue.toFixed(4) + ", Avg: " + avgValue.toFixed(4), 10, 35);
            this.ctx.restore();
        }
    }
}
