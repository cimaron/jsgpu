/*
Copyright (c) 2011 Cimaron Shanahan

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
 * Primitive Object Class
 */
function Primitive() {
	this.mode = null;
	this.vertices = [];
	this.sorted = false;
	this.direction = null;
}

proto = Primitive.prototype;

/**
 * Get direction
 */
proto.getDirection = function() {
	var a, E, i, th, n;

	if (this.direction) {
		return this.direction;	
	}

	n = this.vertices.length;
	E = 0;
	for (i = 0; i < n; i++) {
		th = (i + 1) % n;
		E += (this.vertices[i].xw * this.vertices[th].yw - this.vertices[th].xw * this.vertices[i].yw);
	}
	E = E > 0 ? 1 : -1;
	
	this.direction = E;

	return this.direction;
};

