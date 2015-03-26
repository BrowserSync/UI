/*jshint -W079 */
var browserSync = require("browser-sync");
var bsui        = require("../../../index");
var assert      = require("chai").assert;
var request     = require("supertest");

describe("Remote debug - Throttle HTTPS", function () {

    var bs, ui;

    this.timeout(10000);

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

    before(function (done) {

        browserSync.reset();

        browserSync.use(bsui);

        var config = {
            online: false,
            open: false,
            logLevel: "silent",
            server: "test/fixtures",
            https: true
        };

        browserSync(config, function (err, out) {
            ui = out.ui;
            bs = out;
            done();
        });
    });
    after(function () {
        bs.cleanup();
    });
    it("should init DSL speed", function (done) {

        var target = ui.options.getIn(["network-throttle", "targets"]).toJS()["dsl"];

        target.active = true;

        target.cb = function (err, out) {
            assert.isDefined(out.server);
            assert.isDefined(out.port);
            assert.isDefined(ui.servers["dsl"]);
            var updated = ui.options.getIn(["network-throttle", "targets"]).toJS()["dsl"];
            assert.include(updated.urls[0], "https://");
            request(updated.urls[0])
                .get("/")
                .set("accept", "text/html")
                .expect(200)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }
                    assert.include(res.text, bs.options.get("snippet"));
                    done();
                });
        };
        ui.throttle["toggle:speed"](target);
    });
});