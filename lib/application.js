var _ = require("underscore");
var Sync = require('sync');
module.exports = Application;

var Resource = require('./resource');

function Application()
{
	this.bootstrapPath = "/bootstrap";
	this.resourcesPaths = [require('path').join(__dirname, "resources")];
	this.config = null;
	this.resources = {};
	this.order = [];
}

Application.prototype.__proto__ = require('events').EventEmitter.prototype;

Application.prototype.bootstrap = function(cb)
{
	var bind = this;
	Sync(function() {
		bind.initStandaloneResources();
		bind.initResources(function(){
			_.toArray(bind.order).forEach(function(name) {
				var resource = bind.resources[name];
				resource.bootstrap.sync(resource);
				bind.emit("bootstrapResource", name, resource);
				bind.emit("bootstrapResource: " + name, resource);
			});

			if (typeof cb === 'function') {
				cb();
			}
			bind.emit("bootstrap");
		});
	});
}

Application.prototype.run = function(cb)
{
	var bind = this;
	Sync(function() {
		_.toArray(bind.order).forEach(function(name) {
			var resource = bind.resources[name];
			resource.run.sync(resource);
			bind.emit("runResource", name, resource);
			bind.emit("runResource: " + name, resource);
		});
		
		if (typeof cb === 'function') {
			cb();
		}
		bind.emit("run");
	});
}

Application.prototype.shutdown = function(cb)
{
	var bind = this;
	Sync(function() {
		_.toArray(bind.order).reverse().forEach(function(name) {
			var resource = bind.resources[name];
			resource.shutdown.sync(resource);
			bind.emit("shutdownResource", name, resource);
			bind.emit("shutdownResource: " + name, resource);
		});
		if (typeof cb === 'function') {
			cb();
		}
		bind.emit("shutdown");
	});
}

Application.prototype.initStandaloneResources = function(cb)
{
	if (!this.config || !this.config.resources) {
		if (typeof cb === 'function') {
			cb();
		}
		return;
	}
	_.each(this.config.resources, function(config, name) {
		var Resource;
		for (var i = 0, il = this.resourcesPaths.length; i < il; i++) {
			var path = null;
			try {
				path = require.resolve(require('path').join(this.resourcesPaths[i], name));
			} catch (e) {
				continue;
			}
			Resource = require(path);
			break;
		}
		var resource = new Resource(this, config);
		this.setResource(name, resource);
	}, this);
	if (typeof cb === 'function') {
		cb();
	}
}

Application.prototype.initResources = function(cb)
{
	var path;
	try {
		path = require.resolve(require('path').join(process.cwd(), this.bootstrapPath));
	} catch (e) {
		if (typeof cb === 'function') {
			cb();
		}
		return;
	}
	var Bootstrap = require(path);
	var bootstrapper = new Bootstrap();
	bootstrapper.application = this;
	bootstrapper.run(function() {
		if (typeof cb === 'function') {
			cb();
		}
	});
}

Application.prototype.setResource = function(name, resource)
{
	if (! (resource instanceof Resource)) {
		throw "'resource' should Resource type";
	}
	resource.application = this;
	this.resources[name] = resource;
	if (this.order.indexOf(name) == -1) {
		this.order.push(name);
	}
	this.emit("resource", name, resource);
	this.emit("resource:" + name, resource);
}

Application.prototype.setConfig = function(config)
{
	this.config = config;
	this.emit("config", config);
}

Application.prototype.get = function(resourceName)
{
	if (!this.resources[resourceName]) {
		throw "No resource named " + resourceName + " found";
	}
	return this.resources[resourceName].get();
}