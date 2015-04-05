/*jshint -W079 */
var browserSync = require("browser-sync");
var ui          = require("../../index");
var assert      = require("chai").assert;
var request     = require("supertest");

describe("Can resolve pluings", function() {

    it.only("can return plugins with added meta data", function(done) {

        browserSync.reset();
        browserSync.use(ui);
        browserSync({
            server: "test/fixtures",
            logLevel: "silent",
            open: false,
            plugins: [
                {
                    "/Users/shakyshane/code/bs-plugins/html-injector": {
                        file: "**/*.html"
                    }
                }
            ]
        }, function (err, bs) {
            assert.equal(bs.ui.bsPlugins.size, 1);
            assert.isTrue(require("immutable").Map.isMap(bs.ui.bsPlugins.get(0).get("pkg")));
            assert.isString(bs.ui.bsPlugins.get(0).get("client:js"));
            //assert.isString(ui.templates);
            bs.cleanup();
            done();
        });
    });
});

