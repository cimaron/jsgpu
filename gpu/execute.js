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


(function(GPU) {

	GPU.execute = function(cmd) {
		if (GPU.commands[cmd[1]]) {
			//console.log(cmd);
			GPU.commands[cmd[1]].apply(GPU, cmd);
		} else {
			//console.log(cmd);
		}
	};

	GPU.commands = {};

	GPU.commands.set = function(ctx, cmd, name, value) {
		ctx[name] = value;
	};

	GPU.commands.setArray = function(ctx, cmd, name, index, value) {
		ctx[name][index] = value;
	};

	GPU.commands.clear = function(ctx, cmd, mask) {
		if (mask && cnvgl.COLOR_BUFFER_BIT) {
			cnvgl.memseta(ctx.colorBuffer, 0, ctx.clearColor, ctx.colorBuffer.size);
		}
		if (mask && cnvgl.DEPTH_BUFFER_BIT) {
			cnvgl.memset(ctx.depthBuffer, 0, ctx.clearDepth);
		}
	};

	GPU.commands.drawPrimitives = function(ctx, cmd, mode, first, count) {
		var i;
		for (i = first; i < count; i++) {
			vertex = new cnvgl.vertex(i);
			GPU.renderer.send(ctx, mode, vertex);
		}
		GPU.renderer.end(ctx, mode);
	};

	GPU.commands.drawIndexedPrimitives = function(ctx, cmd, mode, first, count, indices) {
		var i;
		for (i = first; i < count; i++) {
			vertex = new cnvgl.vertex(indices[i]);
			GPU.renderer.send(ctx, mode, vertex);
		}
		GPU.renderer.end(ctx, mode);
	};
		
	GPU.commands.uploadProgram = function(ctx, cmd, name, data) {
		if (name == 'vertex') {
			GPU.uploadVertexShader(data);
		} else {
			GPU.uploadFragmentShader(data);
		}
	};

	GPU.commands.uploadAttributes = function(ctx, cmd, location, size, stride, si, data) {
		var ds, i, c, array, dest;

		ds = Math.ceil(data.length / (size + stride)) * 4;
		dest = cnvgl.malloc(ds, 1);

		GPU.memory.attributes[location] = dest;
		array = dest;

		c = 0;
		for (i = 0; i < ds; i++) {

			if (c < size) {
				array[i] = data[si];
				si++;
			} else {
				array[i] = (c == 3) ? 1 : 0;
			}

			c++;
			if (c == 4) {
				si += stride;
				c = 0;
			}
		}
	};

	GPU.commands.uploadUniforms = function(ctx, cmd, location, data, slots, components) {
		var i;
		for (i = 0; i < slots; i++) {
			cnvgl.memcpy(GPU.memory.uniforms, (location + i) * 4, data, components, (components * i));
		}
	};

}(GPU));

