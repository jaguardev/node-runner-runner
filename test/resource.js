var assert = require("assert");

var Resource = require("../lib/resource");

describe("Resource", function(){
	describe("#Resource([object], [application])", function(){
		it("should create object", function(){
			var resource = new Resource();
			assert(resource instanceof Resource);
		});
		it("should set 'object' property if 'object' param passed", function(){
			var resource = new Resource("xyu");
			assert.equal("xyu", resource.object);
		});
		it("should set 'object' property as null if no 'object' param passed", function(){
			var resource = new Resource();
			assert.strictEqual(null, resource.object);
		});
		it("should set 'application' property if 'application' param passed", function(){
			var resource = new Resource(null, "xyu");
			assert.equal("xyu", resource.application);
		});
		it("should set 'application' property as null if no 'application' param passed", function(){
			var resource = new Resource();
			assert.strictEqual(null, resource.application);
		});
	});
	describe("#get()", function() {
		it("should return 'object'", function(){
			var resource = new Resource();
			resource.object = "xyu";
			assert.equal("xyu", resource.get());
		});
	});
	describe("#bootstrap(cb)", function() {
		it("should call callback function", function(done){
			var resource = new Resource();
			resource.bootstrap(done);
		});
		it("should throw error if no callback function passed", function(){
			var resource = new Resource();
			assert.throws(function() {
				resource.bootstrap();
			});
		});
	});
	describe("#run(cb)", function() {
		it("should call callback function", function(done){
			var resource = new Resource();
			resource.run(done);
		});
		it("should throw error if no callback function passed", function(){
			var resource = new Resource();
			assert.throws(function() {
				resource.run();
			});
		});
	});
	describe("#shutdown(cb)", function() {
		it("should call callback function", function(done){
			var resource = new Resource();
			resource.shutdown(done);
		});
		it("should throw error if no callback function passed", function(){
			var resource = new Resource();
			assert.throws(function() {
				resource.shutdown();
			});
		});
	});
});