var urls    = require("../../server/urls");
var sinon = require("sinon");
var assert = require("chai").assert;

describe("Adding Urls", function() {

    var validUrls, emitSpy, bs;

    beforeEach(function () {
        validUrls   = [{
            path: "/"
        }];

        emitSpy = sinon.spy();

        bs = {
            io: {
                sockets: {
                    emit: emitSpy
                }
            }
        };
    });

    it("Adds a new url & emits to socket", function () {
        var actual   = urls.trackUrls(validUrls, validUrls[0].path);
        var expected = 1;
        assert.equal(actual.length, expected);
    });
});