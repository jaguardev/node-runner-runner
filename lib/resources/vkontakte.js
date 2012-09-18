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
	var bind = this;
	var query = vkontakte(this.config.clientId, this.config.clientSecret);
	var checkAuthKey = function checkAuthKey(viewerId, authKey) {
		var crypto = require("crypto");
		var hash = crypto.createHash('md5').update(bind.config.clientId + "_" + viewerId + "_" + bind.config.clientSecret).digest("hex");
		if (authKey == hash) {
			return true;
		} else {
			return false;
		}
	};
	this.object = {query: query, checkAuthKey: checkAuthKey};
	cb();
}