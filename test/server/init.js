/*jshint -W079 */
var browserSync = require("browser-sync");
var cp          = require("../../index");
var assert      = require("chai").assert;
var request     = require("supertest");

describe("Can be started with browserSync instance", function() {

    var bsInstance, ui;

    before(function (done) {

        browserSync.use(cp);

        var config = {
            online: false,
            logLevel: "silent"
        };
        bsInstance = browserSync(config, function (err, bs) {
            ui = bs.ui;
            done();
        }).instance;
    });

    after(function () {
        bsInstance.cleanup();
    });

    it("can register as plugin", function() {
        assert.ok(ui);
    });
    it("can serve from lib dir", function(done) {
        request(ui.server)
            .get("/")
            .expect(200)
            .end(function (err, res) {
                assert.include(res.text, "<title>Browser Sync</title>");
                done();
            });
    });
});

