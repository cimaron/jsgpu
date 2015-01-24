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


function CommandQueue(driver) {
	this.commands = [];
	this.timer = null;
	this.driver = driver;
}

proto = CommandQueue.prototype;

/**
 * Enqueue a command
 */
proto.enqueue = function(cmd) {
	this.commands.push(cmd);
	this.schedule();
};


proto.process = function() {
	var command, start, now, result;

	this.timer = null;
	start = Date.now();

	while (this.commands.length > 0) {

		command = this.commands.shift();
		result = GPU.execute(command);
		
		if (!result) {
			this.commands.unshift(command);
			this.schedule();
			return;
		}

		now = Date.now();

		if (this.commands.length > 0 && now - start > 200) {
			this.schedule();
			return;
		}
	}

	this.driver.present();
};

/**
 * Schedule the next batch
 */
proto.schedule = function() {
	var This;
	if (!this.timer) {
		This = this;
		this.timer = setTimeout(function() { This.process(); }, 0);
	}
};

GPU.CommandQueue = CommandQueue;



