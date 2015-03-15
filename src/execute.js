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

function Execute(cmd) {

	if (GPU.commands[cmd[1]]) {
		return GPU.commands[cmd[1]].apply(GPU, cmd);
	} else {
		//console.log(cmd);
	}
}

GPU.execute = Execute;

GPU.commands = {};

GPU.commands.set = function(ctx, cmd, name, value) {
	ctx[name] = value;
	return true;
};

GPU.commands.setArray = function(ctx, cmd, name, index, value) {
	ctx[name][index] = value;
	return true;
};

GPU.commands.clear = function(ctx, cmd, mask) {
	if (mask && cnvgl.COLOR_BUFFER_BIT) {
		cnvgl.memseta(ctx.colorBuffer, 0, ctx.clearColor, ctx.colorBuffer.size);
	}
	if (mask && cnvgl.DEPTH_BUFFER_BIT) {
		cnvgl.memset(ctx.depthBuffer, 0, ctx.clearDepth);
	}
	if (mask && cnvgl.STENCIL_BUFFER_BIT) {
		cnvgl.memset(ctx.stencilBuffer, 0, ctx.clearStencil);
	}
	return true;
};

var cache = {
	i : -1,
	data : []
};


GPU.commands.drawPrimitives = function(ctx, cmd, mode, first, count) {
	var start, now, vertex;
	
	start = Date.now();
	if (cache.i == -1) {
		cache.i = first;
	}
	for (; cache.i < count; cache.i++) {
		vertex = new VertexObject(cache.i);
		GPU.renderer.send(ctx, mode, vertex);

		now = Date.now();
		if (now - start > 200) {
			//time limit is up
			cache.i++;
			return false;
		}
	}
	GPU.renderer.end(ctx, mode);
	cache.i = -1;
	return true;
};


GPU.commands.drawIndexedPrimitives = function(ctx, cmd, mode, indices, first, count, type) {
	var start, now, idx;
	
	start = Date.now();
	if (cache.i == -1) {
		cache.data = [];
		cache.i = first;
	}

	for (; cache.i < count; cache.i++) {
		
		idx = indices[first + cache.i];

		if (cache.data[idx]) {
			vertex = cache.data[idx];
		} else {
			vertex = new VertexObject(idx);
			cache.data[idx] = vertex;
		}

		GPU.renderer.send(ctx, mode, vertex);

		now = Date.now();
		if (now - start > 200) {
			//time limit is up
			cache.i++;
			return false;
		}
	}

	GPU.renderer.end(ctx, mode);
	cache.i = -1;
	return true;
};

/**
 * Upload shader programs
 *
 * @param   object   ctx   Context
 * @param   string   cmd   Command
 * @param   object   prog  Programs 
 */
GPU.commands.uploadProgram = function(ctx, cmd, prog) {
	Program.uploadProgram(ctx, prog);
	return true;
};

GPU.commands.uploadAttributes = function(ctx, cmd, location, size, stride, si, data) {
	var ds, i, c, dest;

	ds = Math.ceil((data.length - si) / (size + stride)) * 4;
	dest = cnvgl.malloc(ds, 1);

	Program.attributes_src[location] = {
		start : location * 4,
		size : size,
		stride : stride,
		si : si,
		data : dest
	};
	
	c = 0;
	for (i = 0; i < ds; i++) {

		if (c < size) {
			dest[i] = data[si];
			si++;
		} else {
			dest[i] = (c == 3) ? 1 : 0;
		}

		c++;
		if (c == 4) {
			si += stride;
			c = 0;
		}
	}
	return true;
};

GPU.commands.uploadUniforms = function(ctx, cmd, location, data, slots, components) {
	var i, j, mem, row, s;

	mem = Program.uniforms;
	row = 4 * location;
	s = 0;

	for (i = 0; i < slots; i++) {
		for (j = 0; j < components; j++) {
			mem[row + j] = data[s++];
		}
		row += 4;
	}

	return true;
};



/**
 * Set Depth Func Command
 */
GPU.commands.setDepthFunc = function(ctx, cmd, fn) {
	Fragment.setDepthFunc(ctx, fn);
	return true;
};


/**
 * Set blend equations
 */
GPU.commands.blendEqs = function(ctx, cmd, rgb, a) {

	Fragment.setBlendEqRgb(ctx, rgb);
	Fragment.setBlendEqA(ctx, a);

	return true;
};

/**
 * Set blend equations
 */
GPU.commands.blendFunc = function(ctx, cmd, src, dest) {

	Fragment.setBlendFnSrc(ctx, src);
	Fragment.setBlendFnDest(ctx, dest);

	return true;
};



/**
 * Bind texture
 *
 * @param   object   ctx      Context
 * @param   string   cmd      Command
 * @param   int      u        Texture unit number
 * @param   int      target   Filter
 * @param   object   state    State
 *
 * @return  bool
 */
GPU.commands.bindTexture = function(ctx, cmd, target, tex_obj, u) {
	var unit, obj;

	unit = Texture.units[u];
	unit.targets[target] = tex_obj;

	return true;
};

GPU.commands.texParameterTextureMinFilter = function(ctx, cmd, tex_obj, param) {
	tex_obj.setMinFilter(param);
	return true;
};

GPU.commands.texParameterTextureMagFilter = function(ctx, cmd, tex_obj, param) {
	tex_obj.setMagFilter(param);
	return true;
};




/**
 * Upload Texture Command
 */
GPU.commands.texImage2D = function(ctx, cmd, tex_obj, level, internalFormat, width, height, format, type, data) {
	var img;

	img = new TextureImage2D(data, width, height, format);
	tex_obj.images[level] = img;

	return true;
};


