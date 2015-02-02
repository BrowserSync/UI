/*jshint -W079 */
var browserSync = require("browser-sync");
var ui          = require("../../index");
var request     = require("supertest");
var assert      = require("chai").assert;

describe("Remote debug", function () {

    var bs, uiInstance;
    this.timeout(10000);
    before(function (done) {

        browserSync.reset();
        browserSync.use(ui);

        var config = {
            online: false,
            open: false,
            server: "test/fixtures",
            logLevel: "silent"
        };

        bs = browserSync(config, function (err, bs) {
            uiInstance = bs.ui;
            done();
        }).instance;
    });
    after(function () {
        bs.cleanup();
    });
    it("should enable a file & allow BrowserSync to serve it", function (done) {

        var cssFile = uiInstance.options.getIn(["clientFiles", "pesticide"]).toJS();

        uiInstance.enableElement(cssFile);

        request(bs.server)
            .get(cssFile.src)
            .expect(200)
            .end(function (err, res) {
                assert.include(res.text, "outline:1px solid #2980b9");
                done();
            });
    });
});