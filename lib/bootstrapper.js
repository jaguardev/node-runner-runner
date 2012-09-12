var _ = require("underscore");
var Application = require('./application');
var Resource = require('./resource');

module.exports = Bootsrapper;

function Bootsrapper(application)
{
	this.application = application;
}

Bootsrapper.prototype.run = function(cb)
{
	if (! (this.application instanceof Application)) {
		throw "Application should be set";
	}
	var bind = this;
	var resources = this.getInitMethodsList();
	if (resources.length == 0) {
		if (typeof cb === 'function')
			cb();
		return;
	}
	_.toArray(resources).forEach(function(name){
		bind["init" + name](function(resource){
			bind.setResource(name, resource);
			resources = _.without(resources, name);
			if (resources.length == 0) {
				if (typeof cb === 'function') {
					cb();
				}
			}
		});
	});
}

Bootsrapper.prototype.getInitMethodsList = function()
{
	return _.chain(_.functions(this))
		.filter(function(element) {return element.indexOf("init") === 0;})
		.map(function(element) {return element.substr(4)}) //"init".length == 4
		.value();
}

Bootsrapper.prototype.setResource = function(name, value)
{
	var resource;
	if (!(value instanceof Resource)) {
		resource = new Resource();
		if (typeof value === 'function') {
			resource.bootstrap = value;
		} else {
			resource.object = value;
		}
	} else {
		resource = value;
	}
	
	this.application.setResource(name, resource);
}