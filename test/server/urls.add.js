/*jshint -W079 */
var urls    = require("../../server/urls");
var assert = require("chai").assert;

describe("Adding Urls", function() {

    var validUrls;

    beforeEach(function () {
        validUrls   = [{
            path: "/"
        }];
    });

    it("Adds a new url", function() {
        var actual   = urls.addPath(validUrls, {path: "forms.html"});
        var expected = 2;
        assert.equal(actual.length, expected);
    });
    it("Adds a new url (2)", function() {
        var updated  = urls.addPath(validUrls, {path: "forms.html"});
        var actual   = urls.addPath(updated, {path: "scrolling.html"});
        var expected = 3;
        assert.equal(actual.length, expected);
    });
    it("Does not add a dupe", function() {
        var updated  = urls.addPath(validUrls, {path: "forms.html"});
        var actual   = urls.addPath(updated, {path: "forms.html"});
        var expected = 2;
        assert.equal(actual.length, expected);
    });
});