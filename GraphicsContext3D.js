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


GraphicsContext3D = (function() {

	function Initializer() {
		//private:
		this.webglCtx = null;
		this.canvas = null;

		this.buffer = null;
		this.context = null;

		this._state = {};
		this._dirty = false;
		
		this._frame = {};
		this._quality = {};
		this.options = {};
	}

	var GraphicsContext3D = new jClass('GraphicsContext3D', Initializer);
	
	//public:

	GraphicsContext3D.GraphicsContext3D = function(webglCtx) {
		var threshold, This;
		this.webglCtx = webglCtx;
		this.canvas = webglCtx.canvas;
		this.context = this.canvas.getContext('2d');

		/*
		//The following attempts to adjust the initial quality setting based
		//the number of pixels in the canvas. This threshold is mostly arbitrary
		//and could stand some more intelligent calculation
		this._quality.startThreshold = 250000;
		if (this.canvas.width * this.canvas.height > this._quality.startThreshold) {
			this._quality.factor = (this.canvas.width * this.canvas.height) / this._quality.startThreshold;
		} else {
			this._quality.factor = 1;
		}
		*/
		this._quality.factor = 1;
		this.setTargetFps(0);
		this.options.showFps = true;

		this._createBuffer();

		//initialize state
		glClearColor(0, 0, 0, 255);
		glClearDepth(1.0);
		glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
		glViewport(0, 0, this.canvas.width, this.canvas.height);

		This = this;
		setInterval(function() { This._redraw(); }, 0);
	};

	//public:

	GraphicsContext3D.activeTexture = function(texture) {
		glActiveTexture(texture);
	};

	GraphicsContext3D.attachShader = function(program, shader) {
		glAttachShader(program, shader);
	};

	GraphicsContext3D.bindAttribLocation = function(program, index, name) {
		glBindAttribLocation(program, index, name);
	};

	GraphicsContext3D.bindFramebuffer = function(target, framebuffer) {
		glBindFramebuffer(target, framebuffer);
	};

	GraphicsContext3D.bindRenderbuffer = function(target, renderbuffer) {
		glBindRenderbuffer(target, renderbuffer);
	};

	GraphicsContext3D.bindTexture = function(target, texture) {
		glBindTexture(target, texture);
	};

	GraphicsContext3D.blendFunc = function(sfactor, dfactor) {
		glBlendFunc(sfactor, dfactor);
	};

	GraphicsContext3D.bufferSubData = function(target, offset, size, data) {
		glBufferSubData(target, offset, size, data);
	};

	GraphicsContext3D.clearDepth = function(depth) {
		glClearDepth(depth);
	};

	GraphicsContext3D.colorMask = function(red, green, blue, alpha) {
		glColorMask(red, green, blue, alpha);
	};

	GraphicsContext3D.createFramebuffer = function() {
		var framebuffers = [];
		glGenFramebuffers(1, framebuffers);
		return framebuffers[0][0];
	};

	GraphicsContext3D.createRenderbuffer = function() {
		var renderbuffers = [];
		glGenRenderbuffers(1, renderbuffers);
		return renderbuffers[0][0];
	};

	GraphicsContext3D.createTexture = function() {
		var textures = [];
		glGenTextures(1, textures);
		return textures[0][0];
	};	

	GraphicsContext3D.cullFace = function(mode) {
		glCullFace(mode);
	};

	GraphicsContext3D.depthFunc = function(func) {
		glDepthFunc(func);
	};

	GraphicsContext3D.depthMask = function(flag) {
		glDepthMask(flag);
	};

	GraphicsContext3D.drawArrays = function(mode, first, count) {
		this._dirty = true;
		glDrawArrays(mode, first, count);
	};

	GraphicsContext3D.drawElements = function(mode, count, type, offset) {
		this._dirty = true;
		glDrawElements(mode, count, type, offset);
	};

	GraphicsContext3D.disableVertexAttribArray = function(index) {
		glDisableVertexAttribArray(index);
	};

	GraphicsContext3D.frontFace = function(mode) {
		glFrontFace(mode);
	};

	GraphicsContext3D.generateMipmap = function(target) {
		//glGenerateMipmap(target);
	};

	GraphicsContext3D.getError = function() {
		return glGetError();
	};

	GraphicsContext3D.getUniformLocation = function(program, name) {
		return glGetUniformLocation(program, name);
	};
	
	GraphicsContext3D.pixelStorei = function(pname, param) {
		glPixelStorei(pname, param);
	};

	GraphicsContext3D.renderbufferStorage = function(target, internalformat, width, height) {
		glRenderbufferStorage(target, internalformat, width, height);
	};

	GraphicsContext3D.uniform1i = function(location, v0) {
		glUniform1i(location, v0);
	};

	GraphicsContext3D.uniform1f = function(location, v0) {
		glUniform1f(location, v0);
	};\

	GraphicsContext3D.uniform3f = function(location, v0, v1, v2) {
		glUniform3f(location, v0, v1, v2);
	};

	GraphicsContext3D.uniform3fv = function(location, value) {
		glUniform3fv(location, 1, value);
	};

	GraphicsContext3D.uniformMatrix3fv = function(location, transpose, value) {
		glUniformMatrix3fv(location, value.length / 9, transpose, value);
	};

	GraphicsContext3D.uniformMatrix4fv = function(location, transpose, value) {
		glUniformMatrix4fv(location, value.length / 16, transpose, value);
	};
	
	GraphicsContext3D.texImage2D = function(target, level, internalformat, width, height, border, format, type, source) {
		glTexImage2D(target, level, internalformat, width, height, border, format, type, source);
	};

	GraphicsContext3D.texParameteri = function(target, pname, param) {
		glTexParameteri(target, pname, param);
	};

	GraphicsContext3D.setTargetFps = function(low, high) {
		this._frame.fps = 0;
		this._frame.last = [];
		this._quality.fpsLow = low;
		this._quality.fpsHigh = high ? high : 1.5 * low;
		this._quality.fpsLowThreshold = 0;
		this._quality.fpsHighThreshold = 0;
	};

	GraphicsContext3D.setQuality = function(q) {
		this._quality.factor = 1 / q;
		this._createBuffer();
	};

	//private:

	GraphicsContext3D._createBuffer = function() {
		var ctx, width, height, data, frameBuffer, depthBuffer, colorBuffer;

		ctx = cnvgl_context.getCurrentContext();

		if (!this.buffer) {
			this.buffer = this.context.createImageData(this.canvas.width, this.canvas.height);
		}
		if (!this._quality.cnv) {
			this._quality.cnv = document.createElement('canvas');
		}

		width = this.canvas.width;
		height = this.canvas.height;

		if (this._quality.factor > 1) {

			width = Math.round(width / this._quality.factor);
			height = Math.round(height / this._quality.factor);
			width = Math.max(width, 1);
			height = Math.max(height, 1);

			this.webglCtx.drawingBufferWidth = width;
			this.webglCtx.drawingBufferHeight = height;

			this._quality.cnv.width = width;
			this._quality.cnv.height = height;
			this._quality.ctx = this._quality.cnv.getContext('2d');
			this.context.mozImageSmoothingEnabled = false;
		}
	};

	GraphicsContext3D._updateFrame = function() {
		var time, dur;
		//update frame counts, fps, etc.
		this._frame.count++;
		time = new Date().getTime();
		this._frame.last.push(time);

		//average over one second period
		dur = time - this._frame.last[0];
		this._frame.fps = 1000 * this._frame.last.length / dur;
		if (dur > 1000) {
			this._frame.last.shift();
		}
	};

	GraphicsContext3D._checkFps = function() {
		var change;

		if (this._frame.fps < this._quality.fpsLow) {
			this._quality.fpsLowThreshold++;
		}

		//must maintain low fps over period of one second
		if (this._quality.fpsLowThreshold > this._frame.fps) {
			this._quality.fpsLowThreshold = 0;
			change = 1 + this._quality.fpsLow / Math.max(this._frame.fps, 1) / 4;
			this._quality.factor *= change;
			this._createBuffer();
		}

		if (this._frame.fps > this._quality.fpsHigh) {
			this._quality.fpsHighThreshold++;
		}

		//must maintain high fps over period of one second
		if (this._quality.fpsHighThreshold > this._frame.fps && this._quality.factor > 1) {
			this._quality.fpsHighThreshold = 0;
			//and even then, only slowly increase the resolution
			this._quality.factor = Math.max(1, this._quality.factor / 1.1);
			this._createBuffer();
		}
	};

	GraphicsContext3D._redraw = function() {

		this._updateFrame();
		if (this._dirty) {
			this._dirty = false;

			if (this._quality.factor > 1) {
				this._quality.ctx.putImageData(this._quality.buffer, 0, 0);
				this.context.drawImage(this._quality.cnv, 0, 0, this.canvas.width, this.canvas.height);
			} else {
				this.context.putImageData(this.buffer, 0, 0);
				if (this.options.showFps) {
					this.context.strokeStyle = "#FFFFFF";
					if (this._frame.fps != Infinity) {
						this.context.strokeText(Math.round(this._frame.fps * 100) / 100, 20, 20);
					}
				}
			}
		}

		this._checkFps();
	};

	return GraphicsContext3D.Constructor;

}());

