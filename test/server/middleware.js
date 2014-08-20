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
});