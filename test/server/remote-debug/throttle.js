/*jshint -W079 */
var browserSync = require("browser-sync");
var bsui        = require("../../../index");
var assert      = require("chai").assert;
var request     = require("supertest");

describe("Remote debug - Throttle", function () {

    var bs, ui;

    this.timeout(10000);

    before(function (done) {

        browserSync.reset();

        browserSync.use(bsui);

        var config = {
            online: false,
            open: false,
            logLevel: "silent",
            server: "test/fixtures"
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
            request(out.server)
                .get("/")
                .set("accept", "text/html")
                .expect(200)
                .end(function (err, res) {
                    assert.include(res.text, bs.options.get("snippet"));
                    done();
                });
        };
        ui.throttle["toggle:speed"](target);
    });
    it("should init 3G speed", function (done) {

        var target = ui.options.getIn(["network-throttle", "targets"]).toJS()["3g"];

        target.active = true;

        target.cb = function (err, out) {
            assert.isDefined(out.server);
            assert.isDefined(out.port);
            assert.isDefined(ui.servers["3g"]);
            request(out.server)
                .get("/")
                .set("accept", "text/html")
                .expect(200)
                .end(function (err, res) {
                    assert.include(res.text, bs.options.get("snippet"));
                    done();
                });
        };
        ui.throttle["toggle:speed"](target);
    });
    it("should init EDGE speed", function (done) {

        var target = ui.options.getIn(["network-throttle", "targets"]).toJS()["edge"];

        target.active = true;

        target.cb = function (err, out) {
            assert.isDefined(out.server);
            assert.isDefined(out.port);
            assert.isDefined(ui.servers["edge"]);
            request(out.server)
                .get("/")
                .set("accept", "text/html")
                .expect(200)
                .end(function (err, res) {
                    assert.include(res.text, bs.options.get("snippet"));
                    done();
                });
        };
        ui.throttle["toggle:speed"](target);
    });
    it("should init GPRS speed", function (done) {

        var target = ui.options.getIn(["network-throttle", "targets"]).toJS()["gprs"];

        target.active = true;

        target.cb = function (err, out) {
            assert.isDefined(out.server);
            assert.isDefined(out.port);
            assert.isDefined(ui.servers["gprs"]);
            request(out.server)
                .get("/")
                .set("accept", "text/html")
                .expect(200)
                .end(function (err, res) {
                    assert.include(res.text, bs.options.get("snippet"));
                    done();
                });
        };
        ui.throttle["toggle:speed"](target);
    });
});