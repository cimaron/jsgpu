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
 * Set the current blend equation
 *
 * @param   function   func   Blend equation
 */
Fragment.setBlendEqRgb = function(ctx, func) {
	this.fn.blendEqRgb = func;
};

/**
 * Set the current blend equation
 *
 * @param   function   func   Blend equation
 */
Fragment.setBlendEqA = function(ctx, func) {
	this.fn.blendEqA = func;
};

/**
 * Set the current blend equation
 *
 * @param   function   func   Blend function
 */
Fragment.setBlendFnSrc = function(ctx, func) {
	this.fn.blendFnSrc = func;
};

/**
 * Set the current blend equation
 *
 * @param   function   func   Blend function
 */
Fragment.setBlendFnDest = function(ctx, func) {
	this.fn.blendFnDest = func;
};




Fragment.fn.blend = {

	/**
	 * Blend equations
	 */
	eqAdd : function(s, d, a, b) {
		return (s * a) + (d * b);
	},

	eqSub : function(s, d, a, b) {
		return (s * a) - (d * b);
	},

	eqRevSub : function(s, d, a, b) {
		return 	(d * b) - (s * a);
	},
	
	fnOne : function(sa, da) {
		return 1;
	},

	fnZero : function(sa, da) {
		return 0;
	},
	
	fnSrcAlpha : function(sa, da) {
		return sa / 255;
	},
	
	fnOneMinusSrcAlpha : function(sa, da) {
		return 1 - (sa / 255);
	},

	fnDestAlpha : function(sa, da) {
		return da / 255;
	},

	fnOneMinusDestAlpha : function(sa, da) {
		return 1 - (da / 255);
	}
	
};

Fragment.fn.blendEqRgb = Fragment.fn.blend.eqAdd;
Fragment.fn.blendEqA = Fragment.fn.blend.eqAdd;

Fragment.fn.blendFnSrc = Fragment.fn.blend.fnOne;
Fragment.fn.blendFnDest = Fragment.fn.blend.fnOne;

//Set up constants
for (var i in Fragment.fn.blend) {
	GPU.constants['fnBlend' + i.charAt(0).toUpperCase() + i.slice(1)] = Fragment.fn.blend[i];
}


