module.exports = Vkontakte;
var  vkontakte = require("vkontakte");

function Vkontakte(application, config)
{
	this.object = null;
	this.application = application || null;
	this.config = config || null;
}

Vkontakte.prototype.__proto__ = require('../standalone-resource').prototype;

Vkontakte.prototype.bootstrap = function(cb)
{
	var vk = vkontakte(this.config.clientId, this.config.clientSecret);
	this.object = vk;
	cb();
}