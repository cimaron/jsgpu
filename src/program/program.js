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

var Program = {};

Program.temp = null;
Program.uniforms = null;
Program.attributes = null;
Program.cur_attributes = null;
Program.varying = null;
Program.result = null;

Program.initialize = function() {
	this.attributes_src = new Array(GPU.constants.program.max_vertex_attribs);
};

Program.uploadProgram = function(ctx, prgm) {

	ctx.prgm = prgm;

	Fragment.uploadFragmentShader(ctx, prgm.fragment);
	Vertex.uploadVertexShader(ctx, prgm.vertex);

	this.uniforms = prgm.context.uniform_f32;
	this.attributes = prgm.context.attribute_f32;
	this.varying = prgm.context.varying_f32;
	this.result = prgm.context.result_f32;	
};

GPU.constants.program = {
	max_vertex_attribs : 16,
	max_varying_vectors : 12
	//...
};


