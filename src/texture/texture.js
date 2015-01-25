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
var Texture = {

	units : [],

	func : {}
};

/**
 * Initialize texture units
 */
Texture.initialize = function() {
	var i, unit, def_img;

	def_img = new Float32Array([0, 0, 0, 1]);

	//initialize texture units
	for (i = 0; i < GPU.capabilities.texture_units; i++) {
		unit = new TextureUnit();
		unit.uploadImage(0, def_img, 1, 1);
		this.units[i] = unit;
	}

	GPU.constants.texture = {
		min_filter : 0,
		max_filter : 1,
		func_nearest : 0,
		func_linear : 1
	};
};

/**
 * Initialize GPU context
 */
Texture.initializeContext = function(ctx) {
};

/**
 * Upload texture into unit
 *
 * @param   object   ctx    Context
 * @param   int      u      Texture unit number
 * @param   array    data   Texture image data
 *
 * @return  bool
 */
Texture.upload = function(ctx, u, data) {
	var unit, i;
	
	if (u < 0 || u >= this.units.length) {
		return false;
	}

	unit = this.units[u];
	unit.reset();

	for (i = 0; i < data.length; i++) {
		unit.uploadImage(i, data[i].data, data[i].width, data[i].height);
	}

	return true;
};

/**
 * Set texture unit filter function
 *
 * @param   object   ctx           Context
 * @param   int      unit          Texture unit number
 * @param   object   texture_obj   Texture object
 * @param   object   texture_obj   Texture object
 *
 * @return  bool
 */
Texture.setUnitFilterFunction = function(ctx, u, filter, fn) {
	var unit, i;
	
	if (u < 0 || u >= this.units.length) {
		return false;
	}

	unit = this.units[u];
	
	unit.setFilterFunction(filter, fn);

	return true;
};


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
Texture.func.tex = function(c, ci, src, si, sampler, target) {
	var s, t, u, v, i,
	    unit,
		img, img_w, img_h, img_d
		;

	s = src[si];
	t = src[si + 1];

	unit = Texture.units[sampler];

	unit.min_func(c, ci, unit, s, t);
};


/**
 * Nearest Neighbor texture lookup function
 *
 * @param   array    c      Color destination array
 * @param   int      ci     Color destination array start offset
 * @param   object   unit   Texture unit
 * @param   number   s      Source s coordinate
 * @param   number   t      Source t coordinate
 */
Texture.func.nearest = function(c, ci, unit, s, t) {
	var u, v, i,
		img, img_w, img_h, img_d
		;

	//@todo: Add mipmap levels
	//img = texture.images[mipmap_level];

	img = unit.images[0];

	img_w = img.width;
	img_h = img.height;
	img_d = img.data;

	/*
	u = (s * img_w)|0; //floor(s * img.width)
	v = (t * img_h)|0; //floor(t * img.height)
	*/
	u = Math.round(s * img_w);
	v = Math.round(t * img_h);
	
	if (u == img_w) {
		u--;
	}
	if (v == img_h) {
		v--;
	}

	i = (v * img_w + u) * 4;
	c[ci + 0] = img_d[i];
	c[ci + 1] = img_d[i + 1];
	c[ci + 2] = img_d[i + 2];
	c[ci + 3] = img_d[i + 3];
};

/**
 * Linear average texture lookup function
 *
 * @param   array    c      Color destination array
 * @param   int      ci     Color destination array start offset
 * @param   object   unit   Texture unit
 * @param   number   s      Source s coordinate
 * @param   number   t      Source t coordinate
 */
Texture.func.linear = function(c, ci, unit, s, t) {
	var u, v, i,
		img, img_w, img_h, img_d,
	    a, b, i1,
	    ui, vi, u0v0, u1v0, u0v1, u1v1, ai, bi;

	//@todo: Add mipmap levels
	//img = texture.images[mipmap_level];

	img = unit.images[0];

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

	i = (vi * img_w + ui) * 4;
	i1 = i + (img_w * 4);

	c[ci + 0] = u0v0 * img_d[i    ] + u1v0 * img_d[i + 4] + u0v1 * img_d[i1    ] + u1v1 * img_d[i1 + 4];
	c[ci + 1] = u0v0 * img_d[i + 1] + u1v0 * img_d[i + 5] + u0v1 * img_d[i1 + 1] + u1v1 * img_d[i1 + 5];
	c[ci + 2] = u0v0 * img_d[i + 2] + u1v0 * img_d[i + 6] + u0v1 * img_d[i1 + 2] + u1v1 * img_d[i1 + 6];
	c[ci + 3] = u0v0 * img_d[i + 3] + u1v0 * img_d[i + 7] + u0v1 * img_d[i1 + 3] + u1v1 * img_d[i1 + 7];			
};

GPU.getTexFunction = function() {
	return Texture.func.tex;
};
