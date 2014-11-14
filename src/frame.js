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

function GpuFrame() {

	this.start = 0;
	this.running = false;

	this.callback = null;
	this.getFrame = this.getAnimationFrameFunc();

	this.fps = 60;
}

var proto = GpuFrame.prototype;

/**
 * Get native animation frame function
 *
 * @return  function
 */
proto.getAnimationFrameFunc = function() {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function(func) {
			window.setTimeout(func, 1000 / 60);
		};
};

proto.setFps = function(fps) {
	var old;
	
	old = this.fps;
	this.fps = fps;
	
	return old;
};

proto.getFrameTime = function() {
	return 1000 / this.fps;
};

proto.getTimeLeft = function(reset) {
	var total, now;
	
	total = this.getFrameTime();
	now = Date.now();

	if (reset) {
		this.start = now;
		return total;
	}

	return (total - (now - this.start));
};


var Frame = new GpuFrame();


/**
 * GPU Api
 */
 
/**
 * Set frames per second value
 *
 * @param   int   fps   Frames per second
 *
 * @return  int
 */
GPU.setFps = function(fps) {
	return Frame.setFps(fps);
};

GPU.getFps = function() {
	return Frame.fps;
};

GPU.onFrame = function(func) {
	Frame.callback = func;
};

GPU.run = function() {
	Frame.running = true;
	CommandBuffer.schedule();
};

GPU.pause = function() {
	Frame.running = false;
};





