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
 * GPU Texture Units
 */
var Texture = {};

GPU.Texture = Texture;

Texture.temp = new Float32Array(4 * 4); //Used for texture filters
Texture.units = [];
Texture.func = {};

/**
 * Define constants and enums
 */
var cnst = {};
GPU.constants.texture = cnst;

cnst.filter = {
	min : 0,
	max : 1
};

cnst.func = {
	nearest : 0,
	linear : 1,
	//Not implemented yet
	linear_mipmap_nearest : 1,
	nearest_mipmap_linear : 1
};




/**
 * Initialize texture units
 */
Texture.initialize = function() {
	var i, unit;

	//initialize texture units
	for (i = 0; i < GPU.capabilities.texture_units; i++) {
		this.units[i] = new TextureUnit();
	}
};

/**
 * Initialize GPU context
 */
Texture.initializeContext = function(ctx) {};

/**
 * Texture lookup function
 *
 * @param   array   c         Color destination array
 * @param   int     ci        Color destination array start offset
 * @param   array   src       Source (s, t), coordinates array
 * @param   int     si        Source array offset
 * @param   int     sampler   Texture unit
 * @param   int     target    Target?
 */
Texture.func.tex2D = function(c, ci, src, si, sampler, target) {
	var s, t,
	    unit, tex
		;

	s = src[si];
	t = src[si + 1];

	unit = Texture.units[sampler];
	tex = unit.targets[target];

	tex.min_filter(c, ci, tex, s, t);
};



Texture.func.lookup_format_rgba = function(data, w, h, comp, u, v, dest, ds) {
	var i;

	i = w * v + u;
	i *= comp;

	dest[ds] = data[i] / 255;
	dest[ds + 1] = data[i + 1] / 255;
	dest[ds + 2] = data[i + 2] / 255;
	dest[ds + 3] = data[i + 3] / 255;
};



/**
 * Nearest Neighbor texture lookup function
 *
 * @param   array    c     Color destination array
 * @param   int      ci    Color destination array start offset
 * @param   object   tex   Texture Object
 * @param   number   s     Source s coordinate
 * @param   number   t     Source t coordinate
 */
Texture.func.nearest = function(c, ci, tex, s, t) {
	var u, v, i,
		img, img_w, img_h, img_d
		;

	//@todo: Add mipmap levels
	//img = texture.images[mipmap_level];

	img = tex.images[0];

	img_w = img.width;
	img_h = img.height;
	img_d = img.data;

	u = Math.round(s * img_w);
	v = Math.round(t * img_h);

	if (u == img_w) {
		u--;
	}
	if (v == img_h) {
		v--;
	}

	Texture.func.lookup_format_rgba(img_d, img_w, img_h, 4, u, v, c, ci);
};

/**
 * Linear average texture lookup function
 *
 * @param   array    c     Color destination array
 * @param   int      ci    Color destination array start offset
 * @param   object   tex   Texture object
 * @param   number   s     Source s coordinate
 * @param   number   t     Source t coordinate
 */
Texture.func.linear = function(c, ci, tex, s, t) {
	var u, v,
		img, img_w, img_h, img_d, colors,
	    a, b,
	    ui, vi, u0v0, u1v0, u0v1, u1v1;

	//@todo: Add mipmap levels
	//img = texture.images[mipmap_level];

	img = tex.images[0];

	img_w = img.width;
	img_h = img.height;
	img_d = img.data;

	u = (s * (img_w - 1));
	v = (t * (img_h - 1));
	
	ui = (u | 0); //floor(s * img.width)
	vi = (v | 0); //floor(t * img.height)
	a = u - ui;
	b = v - vi;

	u0v0 = (1 - a) * (1 - b);
	u1v0 =      a  * (1 - b);
	u0v1 = (1 - a) *      b ;
	u1v1 =      a  *      b ;

	colors = Texture.temp;

	Texture.func.lookup_format_rgba(img_d, img_w, img_h, 4, ui    , vi    , colors, 0);
	Texture.func.lookup_format_rgba(img_d, img_w, img_h, 4, ui + 1, vi    , colors, 4);
	Texture.func.lookup_format_rgba(img_d, img_w, img_h, 4, ui    , vi + 1, colors, 8);
	Texture.func.lookup_format_rgba(img_d, img_w, img_h, 4, ui + 1, vi + 1, colors, 12);
	
	c[ci + 0] = u0v0 * colors[0] + u1v0 * colors[4] + u0v1 * colors[8] + u1v1 * colors[12];
	c[ci + 1] = u0v0 * colors[1] + u1v0 * colors[5] + u0v1 * colors[9] + u1v1 * colors[13];
	c[ci + 2] = u0v0 * colors[2] + u1v0 * colors[6] + u0v1 * colors[10] + u1v1 * colors[14];
	c[ci + 3] = u0v0 * colors[3] + u1v0 * colors[7] + u0v1 * colors[11] + u1v1 * colors[15];
};

GPU.getTexFunction2D = function() {
	return Texture.func.tex2D;
};

