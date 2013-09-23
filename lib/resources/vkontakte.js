module.exports = Vkontakte;
var crypto = require("crypto");
var vkontakte = require("vkontakte");
var _ = require("underscore");

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
		var hash = crypto.createHash('md5').update(bind.config.clientId + "_" + viewerId + "_" + bind.config.clientSecret).digest("hex");
		if (authKey == hash) {
			return true;
		} else {
			return false;
		}
	};
    var checkSignature = function(params) {
        var signature = params.sig;
        var str = _.chain(params)
                    .omit("sig")
                    .keys()
                    .sortBy()
                    .map(function(key) {return key + "=" + params[key];})
                    .value()
                    .join("");
        var hash = crypto.createHash('md5').update(str + bind.config.clientSecret).digest("hex");
        return hash == signature;
    };
	this.object = {query: query, checkAuthKey: checkAuthKey, checkSignature: checkSignature};
	cb();
};