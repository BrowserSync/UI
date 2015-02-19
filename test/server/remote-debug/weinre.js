/*jshint -W079 */
var browserSync = require("browser-sync");
var assert      = require("chai").assert;

describe("Remote debug - weinre", function () {

    var bs, ui;

    this.timeout(10000);

    before(function (done) {

        browserSync.reset();
        browserSync.use(require("../../../index"));

        var config = {
            online: false,
            open: false,
            server: "test/fixtures",
            logLevel: "silent"
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
    it("Has weinre external file", function (done) {
        assert.isDefined(ui.options.getIn(["clientFiles", "weinre"]));
        done();
    });
});

describe("Remote debug - weinre https", function () {

    var bs, ui;

    this.timeout(10000);

    before(function (done) {

        browserSync.reset();
        browserSync.use(require("../../../index"));

        var config = {
            online: false,
            open: false,
            server: "test/fixtures",
            https: true,
            logLevel: "silent"
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
    it("DOES NOT have weinre external file", function (done) {
        assert.isUndefined(ui.options.getIn(["clientFiles", "weinre"]));
        done();
    });
});