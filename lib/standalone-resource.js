module.exports = StandaloneResource;

function StandaloneResource(application, config)
{
	this.object = null;
	this.application = application || null;
	this.config = config || null;
}

StandaloneResource.prototype.__proto__ = require('./resource').prototype;