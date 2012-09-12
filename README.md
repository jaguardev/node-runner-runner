node-runner-runner
==================

var Application = require("runner-runner").Application;
var app = new Application();
app.bootstrap(function() {
	app.run(function() {
		settimeout(function() {
			app.shutdown();
		}, 5000);
	);
});