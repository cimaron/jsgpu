/*
Copyright (c) 2014 Cimaron Shanahan

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/


function BaseBuffer(size, type) {

	this.size = size;

	this.data = new type(size);

	this.id = Objects.add(this);
};



/**
 * Color Buffer Class
 */
function ColorBuffer(width, height) {

	if (!height) {
		height = 1;
	}

	this.width = width;
	this.height = height;

	BaseBuffer.apply(this, [this.width * this.height * 4, Uint8ClampedArray]);
}

util.inherits(ColorBuffer, BaseBuffer);

var proto = ColorBuffer.prototype;

/**
 * Clear Buffer
 */
proto.clear = function(color) {
	this.rect(0, 0, this.width - 1, this.height - 1, color);	
};

/**
 * Draw rectangle
 */
proto.rect = function(x1, y1, x2, y2, color) {
	var i, j, row_width, row_start, start, end, temp;

	if (x1 > x2) {
		temp = x2; x2 = x1; x1 = temp;
	}

	if (y1 > y2) {
		temp = y2; y2 = y1; y1 = temp;
	}

	x1 *= 4;
	x2 *= 4;
	row_width = this.width * 4;
	row_start = y1 * row_width;

	for (i = y1; i <= y2; i++) {

		start = x1 + row_start;
		end = x2 + row_start;

		for (j = start; j <= end; j+=4) {
			this.data[j] = color[0];	
			this.data[j + 1] = color[1];	
			this.data[j + 2] = color[2];
			this.data[j + 3] = color[3];	
		}

		row_start += row_width;
	}

};





function DepthBuffer(width, height) {
	var size;

	if (height) {
		size = width * height;
	} else {
		size = width;
		height = 1;
	}

	this.width = width;
	this.height = height;

	this.buffer = new Float32Array(size);
}





/**
 * GPU Api
 */
GPU.createColorBuffer = function(w, h, b) {
	return new ColorBuffer(w, h, b);
};

GPU.execClearBuffer = function(buffer, color) {
	buffer.clear(color);
};

GPU.execRectangle = function(buffer, x1, y1, x2, y2, color) {
	buffer.rect(x1, y1, x2, y2, color);
};




