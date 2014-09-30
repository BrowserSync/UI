var cp    = require("../../index");
var sinon = require("sinon");
var assert = require("chai").assert;

describe.only("Adding Urls", function() {

    var validUrls;

    beforeEach(function () {
        validUrls   = [{
            path: "/"
        }];
        //var bsStub = sinon.spy();
        //
        //var bs = {
        //    io: {
        //        sockets: {
        //            emit: bsStub
        //        }
        //    }
        //};
    });

    it("Adds a new url", function() {
        var actual   = cp.addPath(validUrls, {path: "forms.html"});
        var expected = 2;
        assert.equal(actual.length, expected);
    });
    it("Adds a new url (2)", function() {
        var updated  = cp.addPath(validUrls, {path: "forms.html"});
        var actual   = cp.addPath(updated, {path: "scrolling.html"});
        var expected = 3;
        assert.equal(actual.length, expected);
    });
    it("Does not add a dupe", function() {
        var updated  = cp.addPath(validUrls, {path: "forms.html"});
        var actual   = cp.addPath(updated, {path: "forms.html"});
        var expected = 2;
        assert.equal(actual.length, expected);
    });
});