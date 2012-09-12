module.exports = Timer;

function Timer(application, config)
{
	this.object = null;
	this.application = application || null;
	this.config = config || null;
	
	this.lastMinute = new Date();
	this.lastHour = new Date();
	this.lastDay = new Date();
	this.lastMonth = new Date();
}

Timer.prototype.__proto__ = require('../standalone-resource').prototype;

Timer.prototype.bootstrap = function(cb)
{
	var bind = this;
	var timer = new (require('events').EventEmitter)();
	this.object = timer;
	cb();
}

Timer.prototype.run = function(cb)
{
	var bind = this;

	bind.object.on("minute", function(current) {
		if (current.getHours() != bind.lastHour.getHours()) {
			bind.lastHour = current;
			bind.object.emit("hour", current);
		}
	});
	bind.object.on("hour", function(current) {
		if (current.getDay() != bind.lastDay.getDay()) {
			bind.lastDay = current;
			bind.object.emit("day", current);
		}
	});
	bind.object.on("day", function(current) {
		if (current.getDay() == 1) {
			bind.object.emit("week", current);
		}
	})
	bind.object.on("day", function(current) {
		if (current.getMonth() != bind.lastMonth.getMonth()) {
			bind.lastMonth = current;
			bind.object.emit("month", current);
		}
	});

	this.object.timer = setInterval(function() {
		var currentDate = new Date();
		if (currentDate.getMinutes() != bind.lastMinute.getMinutes()) {
			bind.lastMinute = currentDate;
			bind.object.emit("minute", currentDate);
		}
	}, 5000);
	cb();
}

Timer.prototype.shutdown = function(cb)
{
	clearTimeout(this.object.timer);
	cb();
}