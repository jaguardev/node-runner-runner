var assert = require("assert")

var Resource = require("../lib/standalone-resource")

describe("StandaloneResource", function(){
	describe("#StandaloneResource([application], [config])", function(){
		it("should create object", function(){
			var resource = new Resource();
			assert(resource instanceof Resource);
		});
		it("should set 'application' property if 'application' param passed", function(){
			var resource = new Resource("xyu");
			assert.equal("xyu", resource.application);
		});
		it("should set 'application' property as null if no 'application' param passed", function(){
			var resource = new Resource();
			assert.strictEqual(null, resource.application);
		});
		it("should set 'config' property if 'config' param passed", function(){
			var resource = new Resource(null, "xyu");
			assert.equal("xyu", resource.config);
		});
		it("should set 'config' property as null if no 'config' param passed", function(){
			var resource = new Resource();
			assert.strictEqual(null, resource.config);
		});
		it("should set 'object' property as null", function(){
			var resource = new Resource();
			assert.strictEqual(null, resource.object);
		});
	});
});