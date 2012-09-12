var assert = require("assert");

var Bootsrapper = require("../lib/bootstrapper");
var Application = require("../lib/application");
var Resource = require("../lib/resource");

describe("Bootsrapper", function(){
	describe("#Bootsrapper(application)", function(){
		it("should create object", function(){
			var bootstrap = new Bootsrapper();
			assert(bootstrap instanceof Bootsrapper);
		});
		it("should set 'application' property", function(){
			var bootstrap = new Bootsrapper("xyu");
			assert.equal("xyu", bootstrap.application);
		});
	});
	describe("#setResource(name, resource)", function(){
		var applicationMock = new Application();
		var resourceMock = new Resource();

		beforeEach(function(){
			applicationMock = new Application();
			resourceMock = new Resource();
		})
		
		it("should call Application#setResource(name, resource)", function(done){
			applicationMock.setResource = function() {
				done();
			}
			
			var bootstrap = new Bootsrapper(applicationMock);
			bootstrap.setResource("xyu", resourceMock);
		});
		it("should call Application#setResource(name, resource) with passed 'name'", function(){
			applicationMock.setResource = function(name) {
				assert.equal("xyu", name);
			}
			
			var bootstrap = new Bootsrapper(applicationMock);
			bootstrap.setResource("xyu", resourceMock);
		});
		it("should call Application#setResource(name, resource) with passed resource, if 'Resource' type passed to 'resource'", function(){
			applicationMock.setResource = function(name, resource) {
				assert.strictEqual(resourceMock, resource);
			}
			
			var bootstrap = new Bootsrapper(applicationMock);
			bootstrap.setResource("xyu", resourceMock);
		});
		it("should call Application#setResource(name, resource) with new Resource, if no 'Resource' type passed to 'resource'", function(){
			applicationMock.setResource = function(name, resource) {
				assert(resource instanceof Resource);
			}
			
			var bootstrap = new Bootsrapper(applicationMock);
			bootstrap.setResource("xyu", 42);
		});
		it("should call Application#setResource(name, resource) with new Resource and Resource#object = value, passed to 'resource'", function(){
			applicationMock.setResource = function(name, resource) {
				assert.equal(42, resource.object);
			}
			
			var bootstrap = new Bootsrapper(applicationMock);
			bootstrap.setResource("xyu", 42);
		});
		it("should call Application#setResource(name, resource) with new Resource and Resource#bootstrap = function, passed to 'resource', if function passed", function(){
			var cuteFunction = function() {};
			applicationMock.setResource = function(name, resource) {
				assert.strictEqual(cuteFunction, resource.bootstrap);
			}
			
			var bootstrap = new Bootsrapper(applicationMock);
			bootstrap.setResource("xyu", cuteFunction);
		});
	});
	describe("#getInitMethodsList()", function(){
		it("should return empty array if no init methods were found", function(){
			var bootstrap = new Bootsrapper();
			assert.deepEqual([], bootstrap.getInitMethodsList());
		});
		it("should return init methods names array", function(){
			var bootstrap = new Bootsrapper();
			bootstrap.init42 = function() {};
			bootstrap.initXyu = function() {};
			assert.deepEqual(["42", "Xyu"], bootstrap.getInitMethodsList());
		});
	});
	describe("#run(cb)", function(){
		
		var applicationMock = new Application();

		beforeEach(function(){
			applicationMock = new Application();
		})
		
		it("should fire error if applications does not instance of Application", function(){
			var bootstrap = new Bootsrapper();
			assert.throws(function() {
				bootstrap.run();
			});
		});
		it("should call callback", function(done){
			var bootstrap = new Bootsrapper(applicationMock);
			bootstrap.run(done);
		});
		it("should call callback immediately and once if no init methods", function(done){
			var bootstrap = new Bootsrapper(applicationMock);
			bootstrap.run(done);
		});
		it("should call init methods", function(done){
			var bootstrap = new Bootsrapper(applicationMock);
			bootstrap.initXyu = function() {
				done();
			}
			bootstrap.run();
		});
		it("should call callback after all init methods are done", function(done){
			var bootstrap = new Bootsrapper(applicationMock);
			var methodsCount = 0;
			bootstrap.initXyu = function(cb) {
				setTimeout(function() {
					methodsCount++;
					cb();
				}, 2);
			}
			bootstrap.init42 = function(cb) {
				setTimeout(function() {
					methodsCount++;
					cb();
				}, 42);
			}
			bootstrap.run(function() {
				assert.equal(2, methodsCount);
				done();
			});
		});
		it("should call #setResource with correct 'name' after init method is done", function(done){
			var bootstrap = new Bootsrapper(applicationMock);
			bootstrap.setResource = function(name) {
				assert.equal("42", name);
				done();
			};
			bootstrap.init42 = function(cb) {
				cb();
			}
			bootstrap.run();
		});
		it("should call #setResource with correct 'resource' after init method is done", function(done){
			var bootstrap = new Bootsrapper(applicationMock);
			bootstrap.setResource = function(name, resource) {
				assert.equal("Xyu", resource);
				done();
			};
			bootstrap.init42 = function(cb) {
				cb("Xyu");
			}
			bootstrap.run();
		});
		it("should call #setResource with correct order", function(done){
			var bootstrap = new Bootsrapper(applicationMock);
			var methodsCount = 0;
			bootstrap.setResource = function(name) {
				methodsCount++;
				if (name == "Xyu") {
					assert.equal(methodsCount, 1);
				} else if (name == "42") {
					assert.equal(methodsCount, 2);
				}
			};
			bootstrap.initXyu = function(cb) {
				setTimeout(function() {
					cb("Xyu");
				}, 2);
			}
			bootstrap.init42 = function(cb) {
				setTimeout(function() {
					cb("42");
				}, 42);
			}
			bootstrap.run(done);
		});
	});
});