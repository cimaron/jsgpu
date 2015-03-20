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
 * Triangle Rendering Class
 */
function RendererPrimitiveTriangle(renderer) {

	this.renderer = renderer;

	this.frag = new FragmentObject();

	this.prim = null;
	this.v1 = null;
	this.v2 = null;
	this.v3 = null;
}

proto = RendererPrimitiveTriangle.prototype;

/**
 * Render triangle
 */
proto.render = function(state, prim) {
	var clipped, num, i;

	if (this.renderer.culling.checkCull(state, prim)) {
		return;
	}
	
	//clipping may split triangle into multiple triangles
	clipped = [];
	num = this.renderer.clipping.clipTriangle(state, prim, clipped);

	for (i = 0; i < num; i++) {
		this.renderClipped(state, clipped[i]);
	}
};

/**
 * Render clipped triangle
 */
proto.renderClipped = function(state, prim) {
	var dir, t;

	this.prim = prim;

	//prepare (sort) vertices
	this.renderer.vertex.sortVertices(prim);
	dir = prim.getDirection();

	if (dir >= 0) {
		t = prim.vertices[2];
		prim.vertices[2] = prim.vertices[1];
		prim.vertices[1] = t;
	}

	this.rasterize(state, prim);
};

/**
 * Rasterize triangle
 */
proto.rasterize = function(state, prim) {
	var v1, v2, v3, dx1, dx2, dx3, yi_start, yi_end, yi, x_start, x_end, vpass;

	v1 = this.v1 = prim.vertices[0];
	v2 = this.v2 = prim.vertices[1];
	v3 = this.v3 = prim.vertices[2];

	this.renderer.interpolate.setVertices(this.v1, this.v2, this.v3);

	dx1 = this.renderer.vertex.slope(v1.xw, v1.yw, v2.xw, v2.yw);
	dx2 = this.renderer.vertex.slope(v1.xw, v1.yw, v3.xw, v3.yw);
	dx3 = this.renderer.vertex.slope(v2.xw, v2.yw, v3.xw, v3.yw);

	//top and bottom bounds
	yi_start = (v1.yw|0) + .5; //floor(v1.yw) + .5
	if (yi_start < v1.yw) {
		yi_start++;
	}
	yi = v3.yw > v2.yw ? v3.yw : v2.yw;
	yi_end = yi + 1;
	if (yi_end >= yi) {
		yi_end--;
	}

	x_start = v1.xw + (yi_start - v1.yw) * dx1;
	x_end = v1.xw + (yi_start - v1.yw) * dx2;
	vpass = false;

	//for each horizontal scanline
	for (yi = yi_start; yi < yi_end; yi++) {

		//next vertex (v1, v2) -> (v2, v3)
		if (!vpass && yi > v2.yw) {
			x_start = v3.xw + (yi - v3.yw) * dx3;
			dx1 = dx3;
			vpass = true;
		}

		//next vertex (v1, v3) -> (v2, v3)
		if (!vpass && yi > v3.yw) {
			x_end = v3.xw + (yi - v3.yw) * dx3;
			dx2 = dx3;
			vpass = true;
		}

		this.rasterizeScanline(state, yi, x_start, x_end);

		x_start += dx1;
		x_end += dx2;
	}
};

/**
 * Rasterize single scanline of triangle
 */
proto.rasterizeScanline = function(state, yi, x_start, x_end) {
	var xi_start, xi_end, xi, i;

	//left and right bounds
	xi_start = (x_start|0) + .5; //floor(x_start) + .5
	if (xi_start < x_start) {
		xi_start++;	
	}
	xi_end = /*ceil*/((x_end + 1-1e-10)|0) - .5;
	if (xi_end >= x_end) {
		xi_end--;
	}

	i = state.viewportW * (yi - .5) + (xi_start - .5);

	for (xi = xi_start; xi <= xi_end; xi++) {
		this.rasterizeFragment(state, xi, yi, i);
		i++;
	}
};

proto.rasterizeFragment = function(state, xi, yi, i) {
	var rend;

	rend = this.renderer;

	rend.interpolate.setPoint(xi, yi);

	//gl_FragCoord
	Program.result[0] = rend.interpolate.interpolateTriangle(this.v1.xw, this.v2.xw, this.v3.xw);
	Program.result[1] = rend.interpolate.interpolateTriangle(this.v1.yw, this.v2.yw, this.v3.yw);
	//gl_FragDepth = result.depth = result[0].z
	Program.result[2] = rend.interpolate.interpolateTriangle(this.v1.zw, this.v2.zw, this.v3.zw);
	Program.result[3] = 1 / rend.interpolate.interpolateTriangle(this.v1.w, this.v2.w, this.v3.w);

	//Early depth test
	//Need to add check for shader writing to depth value.
	//If so, this needs to run after processing the fragment
	if (state.depthTest) {
		if (!Fragment.fn.depthFunc(state, i, Program.result[2])) {
			return;
		}
	}

	rend.interpolate.interpolateVarying(state, this.v1, this.v2, this.v3, this.frag.attrib);

	rend.fragment.process(state, this.frag);
	rend.fragment.write(state, i, this.frag);	
};

