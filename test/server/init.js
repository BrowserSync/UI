/*jshint -W079 */
var browserSync = require("browser-sync");
var cp          = require("../../index");
var assert      = require("chai").assert;
var config      = require("../../lib/config");
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
        controlPanel.server.close();
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
    it("can serve the Socket JS file", function (done) {
        request(controlPanel.server)
            .get(config.defaults.socketJs)
            .expect(200, done);
    });
    it("can serve the Connector JS file", function (done) {
        request(controlPanel.server)
            .get(config.defaults.connector)
            .expect(200, done);
    });
    it("can serve the main App JS file", function (done) {
        request(controlPanel.server)
            .get(config.defaults.app)
            .expect(200, function (err, res) {
                assert.include(res.text, "angular");
                done();
            });
    });
    it("can add the pagemarkup", function (done) {
        request(controlPanel.server)
            .get("/")
            .expect(200)
            .end(function (err, res) {
                assert.include(res.text, controlPanel.pageMarkup);
                done();
            });
    });
    it("can serve random files", function (done) {
        request(controlPanel.server)
            .get(config.defaults.appCss)
            .expect(200)
            .end(function (err, res) {
                assert.include(res.text, "html");
                done();
            });
    });
});
