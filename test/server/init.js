//var browserSync = require("browser-sync");
var browserSync = require("/Users/shakyshane/sites/os-browser-sync");
var cp          = require("../../index");
var assert      = require("chai").assert;
var sinon       = require("sinon");
var request     = require("supertest");

describe.only("Can be started with browserSync instance", function() {
    
    var bsInstance;
    var cpInstance;
    
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
            .get("/js/vendor/socket.js")
            .expect(200, done);
    });
    it("can serve the Connector JS file", function (done) {
        request(cp.server)
            .get("/js/connector.js")
            .expect(200, done);
    });
    it("can serve the main App JS file", function (done) {
        request(cp.server)
            .get("/js/app.js")
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
    it("can serve the templates", function (done) {
        var templates = cp.instance.templates;
        var template = Object.keys(templates)[0];
        request(cp.server)
            .get("/" + template)
            .expect(200)
            .end(function (err, res) {
                assert.include(res.text, templates[template].toString());
                done();
            });
    });
});
