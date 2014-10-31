/**
 *
 * E2E tests for the History plugin
 *
 */
var assert = require("chai").assert;

describe('History section', function() {

    var expected, selector, menu, bsUrl;
    var ptor = protractor.getInstance();
    var url;

    beforeEach(function () {
        browser.ignoreSynchronization = true;
        browser.get("/plugins");
        bsUrl     = process.env["BS_URL"];
    });
    it("should list the form sync options", function () {

        element.all(by.repeater("plugin in ui.plugins")).count().then(function (count) {
            assert.equal(1, count);
        });

        element.all(by.css(".bs-main-section ul li")).count().then(function (count) {
            assert.equal(1, count);
        });
    });
});