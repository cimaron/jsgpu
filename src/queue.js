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

function GpuQueue() {
	this.data = [];
	this.count = 0;
}

var proto = GpuQueue.prototype;

proto.enqueue = function(item) {
	this.data.push(item);
};

proto.dequeue = function() {

	this.count++;

	return this.data.shift();
};

proto.reset = function() {
	this.data = [];
};

proto.process = function() {
	var time, item;

	time = Frame.getTimeLeft(true);

	while (Frame.getTimeLeft() > 0 && DrawQueue.data.length > 0) {
		item = DrawQueue.dequeue();
		item.func.apply(GPU, item.args);
	}

	Frame.callback({
		frame : Frame.getFrameTime(),
		left : Frame.getTimeLeft(),
		total : (Frame.getFrameTime() - Frame.getTimeLeft())
	});

	this.schedule();
};

proto.schedule = function() {

	var This = this;
	
	if (Frame.running) {
		Frame.getFrame.apply(window, [function() { This.process(); }]);
	}	
};

var DrawQueue = new GpuQueue();

/**
 * GPU Api
 */
GPU.draw = function(cmd, args) {
	DrawQueue.enqueue({func : cmd, args : args});
};

GPU.empty = function() {
	DrawQueue.reset();
};





