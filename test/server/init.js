var browserSync = require("browser-sync");
var cp          = require("../../index");
var assert      = require("chai").assert;
var sinon       = require("sinon");

describe("Can be started with browserSync instance", function(){

    it("can register as plugin", function(done) {

        browserSync.use(cp);

        var config = {
            online: false
        };

        var instance = browserSync(config, function () {
            assert.ok(instance.pluginManager.get(cp["plugin:name"]));
            instance.cleanup();
            done();
        });
    });
});
