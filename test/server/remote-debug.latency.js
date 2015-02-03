/*jshint -W079 */
var browserSync = require("browser-sync");
var bsui        = require("../../index");
//var request     = require("request");
var assert      = require("chai").assert;

describe("Remote debug - Latency", function () {

    var bsInstance, ui;
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

        bsInstance = browserSync(config, function (err, bs) {
            ui = bs.ui;
            done();
        }).instance;
    });
    after(function () {
        bsInstance.cleanup();
    });
    it("should Init Latency plugin on/off", function (done) {

        var latency = ui.options.getIn(["remote-debug", "latency"]).toJS();
        assert.deepEqual(latency.rate, 0);
        assert.deepEqual(latency.active, false);

        ui.latency.toggle(true);
        latency = ui.options.getIn(["remote-debug", "latency"]).toJS();
        assert.deepEqual(latency.active, true);
        ui.latency.toggle(false);
        latency = ui.options.getIn(["remote-debug", "latency"]).toJS();
        assert.deepEqual(latency.active, false);

        done();
    });
});