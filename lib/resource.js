module.exports = Resource;

function Resource(object, application)
{
	this.object = object || null;
	this.application = application || null;
}

Resource.prototype.bootstrap = function(cb)
{
	cb();
}

Resource.prototype.run = function(cb)
{
	cb();
}

Resource.prototype.shutdown = function(cb)
{
	cb();
}

Resource.prototype.get = function()
{
	return this.object;
}