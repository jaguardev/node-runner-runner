node-runner-runner
==================

[![build status](https://secure.travis-ci.org/jaguardev/node-runner-runner.png)](http://travis-ci.org/jaguardev/node-runner-runner)

Usage
-----

```js
var Application = require("runner-runner").Application;

var app = new Application();

app.bootstrap(function() {

	app.run(function() {

		settimeout(function() {

			app.shutdown();

		}, 5000);

	);

});
```