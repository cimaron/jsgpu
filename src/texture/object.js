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
 * Texture Object Class
 */
function TextureObject() {

	this.images = [];
	this.images.push(TextureImage.default_2D);
	
	this.min_filter = Texture.func.nearest;
	this.mag_filter = Texture.func.nearest;
}

GPU.TextureObject = TextureObject;

TextureObject.default_2D = new TextureObject();


proto = TextureObject.prototype;

/**
 * Get filter function by enum
 *
 * @return  function
 */
proto.getFilterFunction = function(fn) {

	switch (fn) {

		case 0: //GPU.constants.texture.func_nearest
			return Texture.func.nearest;
			break

		default:
		case 1: //GPU.constants.texture.func_linear
			return Texture.func.linear;
	}
};


/**
 * Set min filter function
 *
 * @param   int   fn   function
 */
proto.setMinFilter = function(fn) {
	this.min_filter = this.getFilterFunction(fn);
};

/**
 * Set mag filter function
 *
 * @param   int   fn   function
 */
proto.setMagFilter = function(fn) {
	this.mag_filter = this.getFilterFunction(fn);
};



