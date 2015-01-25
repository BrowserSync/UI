/*jshint -W079 */
var browserSync = require("browser-sync");
var cp          = require("../../index");
var assert      = require("chai").assert;
var request     = require("supertest");

describe("Can be started with browserSync instance", function() {

    var bsInstance, controlPanel;

    before(function (done) {

        browserSync.use(cp);

        var config = {
            online: false,
            logLevel: "silent"
        };
        bsInstance = browserSync(config, function () {
            controlPanel = bsInstance.pluginManager.getReturnValues(cp["plugin:name"])[0].value;
            controlPanel.getServer(done);
        }).instance;
    });

    after(function () {
        bsInstance.cleanup();
    });

    it("can register as plugin", function() {
        assert.ok(controlPanel);
    });
    it("can serve from lib dir", function(done) {
        request(controlPanel.server)
            .get("/")
            .expect(200)
            .end(function (err, res) {
                assert.include(res.text, "<title>Browser Sync</title>");
                done();
            });

    });
});

