var assert = require("assert");

var Application = require("../lib/application");
var Resource = require("../lib/resource");

describe("Application", function(){
	describe("#Application()", function(){
		it("should create object", function(){
			var app = new Application();
			assert(app instanceof Application);
		});
		it("should set 'bootstrapPath' property", function(){
			var app = new Application();
			assert.equal("/bootstrap", app.bootstrapPath);
		});
		it("should set 'resourcesPaths' property", function(){
			var app = new Application();
			assert(app.resourcesPaths instanceof Array);
			assert.deepEqual([require('path').resolve(require('path').join("lib", "resources"))], app.resourcesPaths);
		});
		it("should set 'config' property", function(){
			var app = new Application();
			assert.strictEqual(null, app.config);
		});
		it("should set 'resources' property", function(){
			var app = new Application();
			assert(app.order instanceof Object);
			assert.deepEqual({}, app.resources);
		});
		it("should set 'order' property", function(){
			var app = new Application();
			assert(app.order instanceof Array);
			assert.deepEqual([], app.order);
		});
	});
	describe("#get(name)", function(){
		it("should throw error if empty 'name' passed", function(){
			var app = new Application();
			assert.throws(function() {
				app.get();
			});
		});
		it("should throw error if wrong 'name' passed", function(){
			var app = new Application();
			assert.throws(function() {
				app.get("Xyu");
			});
		});
		it("should return resource's object", function(){
			var resource = new Resource();
			resource.object = "xyu";
			var app = new Application();
			app.resources.Xyu = resource;
			assert.equal("xyu", app.get("Xyu"));
		});
	});
	describe("#setConfig(config)", function(){
		it("should set 'config' property", function(){
			var app = new Application();
			app.setConfig("Xyu");
			assert.equal("Xyu", app.config);
		});
		it("should emit 'config' event", function(done){
			var app = new Application();
			app.on("config", done);
			app.setConfig();
		});
		it("should emit 'config' event with passed config", function(done){
			var app = new Application();
			app.on("config", function(config) {
				assert.equal("Xyu", config);
				done();
			});
			app.setConfig("Xyu");
		});
	});
	describe("#setResource(name, resource)", function(){
		it("should throw error if 'resource' is not Resource type", function(){
			var app = new Application();
			assert.throws(function() {
				app.setResource();
			});
			assert.throws(function() {
				app.setResource(null, {});
			});
			assert.throws(function() {
				app.setResource(null, "Xyu");
			});
		});
		it("should set self as 'resource's aplication", function(done){
			var app = new Application();
			var resource = new Resource();
			resource.__defineSetter__("application", function(value) {
				assert.strictEqual(app, value);
				done();
			});
			app.setResource("Xyu", resource);
		});
		it("should set correct 'resource's order", function(){
			var app = new Application();
			var resource = new Resource();
			app.setResource("Xyu", resource);
			app.setResource("42", resource);
			assert.deepEqual(["Xyu", "42"], app.order);
			
		});
		it("should not change 'resource's order if not the first time called with the same resource name", function(){
			var app = new Application();
			var resource = new Resource();
			app.setResource("Xyu", resource);
			app.setResource("42", resource);
			app.setResource("Xyu", resource);
			assert.deepEqual(["Xyu", "42"], app.order);
		});
		it("should add 'resource'", function(){
			var app = new Application();
			var resource = new Resource();
			app.setResource("Xyu", resource);
			assert.strictEqual(resource, app.resources.Xyu);
		});
		it("should replace 'resource' if not the first time called", function(){
			var app = new Application();
			var resource1 = new Resource();
			var resource2 = new Resource();
			app.setResource("Xyu", resource1);
			app.setResource("Xyu", resource2);
			assert.strictEqual(resource2, app.resources.Xyu);
		});
		it("should emit 'resource' event", function(done){
			var app = new Application();
			app.on("resource", function() {
				done();
			});
			var resource = new Resource();
			app.setResource("Xyu", resource);
		});
		it("should emit 'resource' event with resource name", function(done){
			var app = new Application();
			app.on("resource", function(name) {
				assert.equal("Xyu", name);
				done();
			});
			var resource = new Resource();
			app.setResource("Xyu", resource);
		});
		it("should emit 'resource' event with resource object", function(done){
			var app = new Application();
			var resource = new Resource();
			app.on("resource", function(name, value) {
				assert.strictEqual(resource, value);
				done();
			});
			app.setResource("Xyu", resource);
		});
		it("should emit 'resource:{Name}' event", function(done){
			var app = new Application();
			app.on("resource:Xyu", function() {
				done();
			});
			var resource = new Resource();
			app.setResource("Xyu", resource);
		});
		it("should emit 'resource:{Name}' event with resource object", function(done){
			var app = new Application();
			var resource = new Resource();
			app.on("resource:Xyu", function(value) {
				assert.strictEqual(resource, value);
				done();
			});
			app.setResource("Xyu", resource);
		});
	});
	describe.skip("#bootstrap([cb])", function(){
		// dont know how to test this shit. it should be refactored
	});
	describe("#run([cb])", function(){
		it("should call Resource#run() for each resource in correct order", function(){
		});
		it("should call Resource#run() for each resource synchronously", function(){
		});
	});
	describe("#shutdown([cb])", function(){
		it("should call Resource#shutdown() for each resource in correct order", function(){
		});
		it("should call Resource#shutdown() for each resource synchronously", function(){
		});
	});
	describe.skip("#initStandaloneResources([cb])", function(){
		// dont know how to test this shit. it should be refactored
	});
	describe.skip("#initResources([cb])", function(){
		// dont know how to test this shit. it should be refactored
	});
});



























