var browserSync = require("/Users/shakyshane/Sites/os-browser-sync");
var cp          = require("../../index");
var assert      = require("chai").assert;
var sinon       = require("sinon");

describe("Can be started with browserSync instance", function(){

    it("can register as plugin", function(done){

        browserSync.use(cp);

        var instance = browserSync({}, function () {
            assert.ok(instance.pluginManager.get(cp["plugin:name"]));
            instance.cleanup();
            done();
        });
    });
    it("can log to the console", function(done){

        browserSync.use(cp);

        var bs = browserSync({}, function () {
            var instance = bs.pluginManager.get("Control Panel");
//            var spy = sinon.spy(console, "log");
//            instance.logger.info("Hi there");
//            var arg = spy.getCall(0).args;
//            console.log(arg);
            bs.cleanup();
            done();
        });
    });
});