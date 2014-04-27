"use strict";

var controlPanel = require("../../index.js").plugin();

var http         = require("http");
var request      = require("supertest");
var connect      = require("connect");
var assert       = require("chai").assert;

var cp = controlPanel({}, "SNIPPET", "CONNECTOR", {});

describe("Using the middleware", function () {

    it("return a function for the middleware", function () {
        assert.isFunction(cp.middleware[0]);
        assert.isFunction(cp.middleware[1]);
    });

    it("should return the basedir for serving the control panel", function (done) {

        var testApp = connect()
            .use(connect.static(cp.baseDir));

        request(testApp)
            .get("/")
            .expect(200)
            .end(function (err, res, req) {
                if (err) {
                    throw err;
                } else {
                    assert.isTrue(res.text.indexOf("BrowserSync") > -1);
                    done();
                }
            });
    });
});