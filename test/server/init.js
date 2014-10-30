//var browserSync = require("browser-sync");
//var browserSync = require("/Users/shakyshane/sites/os-browser-sync");
//var browserSync = require("/Users/shaneobsourne/sites/browser-sync");
var browserSync = require("/Users/shakyshane/sites/os-browser-sync");
var cp          = require("../../index");
var assert      = require("chai").assert;
var sinon       = require("sinon");
var config      = require("../../server/config");
var request     = require("supertest");

describe("Can be started with browserSync instance", function() {

    var bsInstance;

    before(function (done) {

        browserSync.use(cp);

        var config = {
            online: false,
            logLevel: "silent"
        };
        cp.events.on("cp:running", function () {
            done();
        });
        bsInstance = browserSync(config);
    });

    after(function () {
        bsInstance.cleanup();
        cp.server.close();
    });

    it("can register as plugin", function() {
        assert.ok(bsInstance.pluginManager.getPlugin(cp["plugin:name"]));
    });
    it("can serve from lib dir", function(done) {
        request(cp.server)
            .get("/")
            .expect(200)
            .end(function (err, res, req) {
                assert.include(res.text, "Browser Sync - Control Panel");
                done();
            });
    });
    it("can serve the Socket JS file", function (done) {
        request(cp.server)
            .get(config.socketJs)
            .expect(200, done);
    });
    it("can serve the Connector JS file", function (done) {
        request(cp.server)
            .get(config.connector)
            .expect(200, done);
    });
    it("can serve the main App JS file", function (done) {
        request(cp.server)
            .get(config.appJs)
            .expect(200, function (err, res) {
                assert.include(res.text, 'angular');
                done();
            });
    });
    it("can add the pagemarkup", function (done) {
        request(cp.server)
            .get("/")
            .expect(200)
            .end(function (err, res) {
                assert.include(res.text, cp.instance.pageMarkup);
                done();
            });
    });
    it("can serve random files", function (done) {
        request(cp.server)
            .get(config.appCss)
            .expect(200)
            .end(function (err, res) {
                assert.include(res.text, "html");
                done();
            });
    });
});
