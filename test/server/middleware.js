"use strict";

var controlPanel = require("../../index.js");
var utils        = require("../../server/utils");

var http         = require("http");
var request      = require("supertest");
var connect      = require("connect");
var serveStatic  = require("serve-static");
var sinon        = require("sinon");
var assert       = require("chai").assert;
var plugin       = controlPanel.plugin();


describe("Sending to a URL", function () {

    var server;
    var stub;
    before(function () {
        var socketStub    = sinon.spy();
        var connectorStub = sinon.spy();
        server = controlPanel.startServer(
            {
                urls: {
                    local: "http://localhost:8080"
                }
            },
            connectorStub,
            socketStub
        );
    });

    it("Should Serve static files", function (done) {

        request(server)
            .get("/")
            .expect(200)
            .end(function (err, res, req) {
                if (err) {
                    throw err;
                } else {
                    assert.isTrue(res.text.indexOf("Browser Sync - Control Panel") > -1);
                    done();
                }
            });
    });

    it("can create a valid url", function () {
        var actual   = utils.createUrl("http://localhost:3000", "index.html");
        var expected = "http://localhost:3000/index.html";
        assert.equal(actual.href, expected);
    });
    it("can create a valid url (2)", function () {
        var actual   = utils.createUrl("http://localhost:3000", "/index.html");
        var expected = "http://localhost:3000/index.html";
        assert.equal(actual.href, expected);
    });
    it("Can verify a url", function (done) {

        var app = connect();
        app.use(serveStatic("test/fixtures"));

        var server = http.createServer(app).listen(3032);

        var url = {
            port: "3032",
            hostname: "localhost",
            pathname: "/index.html",
            path: "/index.html",
            href: "http://localhost:3032/index.html"
        };

        utils.verifyUrl(url, function (err, res) {
            if (res) {
                server.close();
                done();
            }
        });
    });
});