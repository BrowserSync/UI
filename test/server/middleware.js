"use strict";

var controlPanel = require("../../index.js");

var http         = require("http");
var request      = require("supertest");
var connect      = require("connect");
var sinon        = require("sinon");
var assert       = require("chai").assert;
var plugin       = controlPanel.plugin();


describe("Using the Control Panel", function () {

    var server;
    var stub;
    before(function () {
        stub = sinon.stub(controlPanel, "getInfoLogger").returns(function(){});
        server = controlPanel.startServer({urls: {local: "http://localhost:8080"}});
    });

    after(function () {
        stub.restore();
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

    it("Should Serve the static JS file with connector", function (done) {

        request(server)
            .get("/js/dist/app.js")
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    throw err;
                } else {
                    assert.isTrue(res.text.indexOf("var ___socket___ = io.connect('http://localhost:8080');") === 0);
                    assert.isTrue(res.text.indexOf("angular") > -1);
                    done();
                }
            });
    });
});