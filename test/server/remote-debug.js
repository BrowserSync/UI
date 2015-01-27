/*jshint -W079 */
var browserSync = require("browser-sync");
var ui          = require("../../index");
var request     = require("request");

describe.only("Remote debug", function () {

    var bsInstance, uiInstance;
    this.timeout(10000);
    before(function (done) {

        browserSync.use(ui);

        var config = {
            online: false,
            open: false,
            server: "test/fixtures"
        };

        bsInstance = browserSync(config, function (err, bs) {
            uiInstance = bs.pluginManager.getReturnValues("UI")[0].value;
            done();
        }).instance;
    });
    after(function () {
        bsInstance.cleanup();
    });
    it("should init", function (done) {

        request(bsInstance.options.getIn(["urls", "local"]) + "/shane", function (err, res, body) {
            done();
        });
    });
});