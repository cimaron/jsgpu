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


/**
 * Color Buffer Class
 */
function ColorBuffer(width, height, bpp) {

	if (!height) {
		height = 1;
	}

	this.width = width;
	this.height = height;
	this.bpp = bpp || 4;
	this.size = this.width * this.height * this.bpp;

	this.data = new Uint8Array(this.size);
}

GPU.ColorBuffer = ColorBuffer;

var proto = ColorBuffer.prototype;


/**
 * Clear Buffer
 *
 * @param   array   color   Color value(s)
 */
proto.clear = function(color) {
	var i, d, s, c1, c2, c3, c4;

	s = this.size;
	d = this.data;

	c1 = color[0];
	c2 = this.bpp >= 2 ? color[1] : 0;
	c3 = this.bpp >= 3 ? color[2] : 0;
	c4 = this.bpp >= 4 ? color[3] : 0;

	switch (this.bpp) {

		case 1:			
			for (i = 0; i < s; i++) {
				d[i] = c1;
			}
			
			break;

		case 2:
			for (i = 0; i < s; i += 2) {
				d[i] = c1;
				d[i + 1] = c2;
			}
			
			break;

		case 3:
			for (i = 0; i < s; i += 3) {
				d[i] = c1;
				d[i + 1] = c2;
				d[i + 2] = c3;
			}
			
			break;

		case 4:
			for (i = 0; i < s; i += 4) {
				d[i] = c1;
				d[i + 1] = c2;
				d[i + 2] = c3;
				d[i + 3] = c4;
			}

			break;
	}
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


