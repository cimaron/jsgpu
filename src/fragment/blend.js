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

	if (!(func in this.fn.blend)) {
		throw new Error("JSGPU: Invalid blend equation");	
	}

	this.fn.blendEqRgb = func;
};

/**
 * Set the current blend equation
 *
 * @param   function   func   Blend equation
 */
Fragment.setBlendEqA = function(ctx, func) {

	if (!(func in this.fn.blend)) {
		throw new Error("JSGPU: Invalid blend equation");	
	}

	this.fn.blendEqA = func;
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
	}
};

Fragment.fn.blendEqRgb = Fragment.fn.blend.eqAdd;
Fragment.fn.blendEqA = Fragment.fn.blend.eqAdd;

