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
 * Primitive Rendering Class
 */
function RendererPrimitive(renderer) {

	this.renderer = renderer;

	this.line = new RendererPrimitiveLine(renderer);
	this.point = new RendererPrimitivePoint(renderer);
	this.triangle = new RendererPrimitiveTriangle(renderer);
	
	this.vertices = [];
}

proto = RendererPrimitive.prototype;

/**
 * Send a vertex
 */
proto.send = function(state, mode, vertex) {
	this.vertices.push(vertex);
	switch (mode) {
		case cnvgl.POINTS:
			this.points(state);
			break;
		case cnvgl.LINES:
			this.lines(state);
			break;
		case cnvgl.LINE_STRIP:
			this.lineStrip(state);
			break;
		case cnvgl.LINE_LOOP:
			this.lineLoop(state);
			break;
		case cnvgl.TRIANGLES:
			this.triangles(state);
			break;
		case cnvgl.TRIANGLE_STRIP:
			this.triangleStrip(state);
			break;
	}
};

/**
 * Finish
 */
proto.end = function(state, mode) {
	switch (mode) {
		case cnvgl.LINE_LOOP:
			//swap vertices
			this.vertices.push(this.vertices.shift());
			this.lines(state);
			break;
	}
	this.vertices = [];
};

/**
 * Render points
 */
proto.points = function(state) {
	var prim;
	prim = new Primitive();
	prim.vertices.push(this.vertices.shift());
	this.point.render(state, prim);
};

/**
 * Render lines
 */
proto.lines = function(state) {
	var prim;
	if (this.vertices.length > 1) {
		prim = new Primitive();
		prim.vertices.push(this.vertices.shift());
		prim.vertices.push(this.vertices.shift());
		this.line.render(state, prim);
	}
};

/**
 * Render line strip
 */
proto.lineStrip = function(state) {
	var prim;
	if (this.vertices.length > 1) {
		prim = new Primitive();
		prim.vertices.push(this.vertices.shift());
		prim.vertices.push(this.vertices[0]);
		this.line.render(state, prim);
	}
};

/**
 * Render line loop
 */
proto.lineLoop = function(state) {
	var prim, v0;
	if (this.vertices.length < 2) {
		return;
	}
	prim = new Primitive();
	if (this.vertices.length > 2) {
		v0 = this.vertices.shift();
		prim.vertices.push(this.vertices.shift());
		prim.vertices.push(this.vertices[0]);
		this.vertices.unshift(v0);
	} else {
		prim.vertices.push(this.vertices[0]);
		prim.vertices.push(this.vertices[1]);
	}
	this.line.render(state, prim);
};

/**
 * Render triangles
 */
proto.triangles = function(state) {
	var prim;
	if (this.vertices.length > 2) {
		prim = new Primitive();
		prim.vertices.push(this.vertices.shift());	
		prim.vertices.push(this.vertices.shift());	
		prim.vertices.push(this.vertices.shift());
		this.triangle.render(state, prim);
	}
};

/**
 * Render triangle strip
 */
proto.triangleStrip = function(state) {
	var prim;
	if (this.vertices.length > 2) {
		prim = new Primitive();
		prim.vertices.push(this.vertices.shift());	
		prim.vertices.push(this.vertices[0]);
		prim.vertices.push(this.vertices[1]);
		this.triangle.render(state, prim);
	}
};

