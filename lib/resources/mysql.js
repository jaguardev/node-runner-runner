module.exports = Mysql;
var  mysql = require("mysql");

function Mysql(application, config)
{
	this.object = null;
	this.application = application || null;
	this.config = config || null;
}

Mysql.prototype.__proto__ = require('../standalone-resource').prototype;

Mysql.prototype.bootstrap = function(cb)
{
	var connection = mysql.createConnection(this.config);
	this.disconnectHandler(connection);
	connection.connect();
	this.object = connection;
	cb();
}

Mysql.prototype.shutdown = function(cb)
{
	this.object.end();
	cb();
}

Mysql.prototype.disconnectHandler = function(connection)
{
	var bind = this;
	connection.on('error', function(err) {
		if (!err.fatal) {
			return;
		}

		if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
			throw err;
		}

		connection = mysql.createConnection(connection.config);
		bind.disconnectHandler(connection);
		connection.connect();
		bind.object = connection;
	});
}