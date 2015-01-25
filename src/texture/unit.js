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
 * Texture Unit Class
 */
function TextureUnit() {
	this.reset();
}

proto = TextureUnit.prototype;

/**
 * Reset texture image data
 */
proto.reset = function() {
	this.images = [];
	this.min_func = Texture.func.nearest;
	this.max_func = Texture.func.nearest;
};

/**
 * Upload texture image
 */
proto.uploadImage = function(i, data, width, height) {
	var img;

	img = new TextureImage(data, width, height);
	this.images[i] = img;
};

/**
 * Set filter function
 */
proto.setFilterFunction = function(filter, fn) {
	var func;
	
	switch (fn) {
		case 0: //GPU.constants.texture.func_nearest
			func = Texture.func.nearest;
			break
		default:
		case 1: //GPU.constnats.texture.func_linear
			func = Texture.func.linear;
	}
	
	//GPU.constants.texture.min_filter = 0, max_filter = 1
	if (filter == 1) {
		this.max_func = func;	
	} else {
		this.min_func = func;	
	}
};

