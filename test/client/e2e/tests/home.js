/**
 *
 *
 */

var assert = require("chai").assert;
var init  = require("./../bs-init");

describe("Section Navigation", function() {

    var selector, menu, headerSelector;

    var bs;
    var ui;
    var bsUrl;
    var cpUrl;

    beforeEach(function () {

        browser.ignoreSynchronization = true;
        selector       = '(key, item) in app.ui.menu | orderObjectBy: \'order\'';
        headerSelector = "h1[bs-heading]";

        init(protractor, {
            server: "./test/fixtures",
            open:   false,
            online: false,
            logLevel: "silent"
        }).then(function (out) {
            bs    = out.bs;
            ui    = out.ui;
            bsUrl = bs.options.getIn(["urls", "local"]);
            cpUrl = bs.options.getIn(["urls", "ui"]);
        });
    });

    afterEach(function () {
        bs.cleanup();
    });

    /**
     *
     * Check that the menu is rendered with the correct amount
     * of links/sections
     *
     */
    it("should render the correct amount of links", function() {
        browser.get(cpUrl);

        var elems = element.all(by.css("[bs-section-nav] li"));
        expect(elems.get(0).getText()).toBe("Overview");
        expect(elems.get(1).getText()).toBe("Sync Options");
        expect(elems.get(2).getText()).toBe("History");
        matchClickToTitle(elems.get(0), headerSelector);
        matchClickToTitle(elems.get(1), headerSelector);
        matchClickToTitle(elems.get(2), headerSelector);

        elems.get(0).click(); // back to homepage
    });

    it("should show the current Browsersync version in header", function() {
        browser.get(cpUrl);
        expect(element(by.css('[bs-link="version"]')).getText()).toBe('v' + bs.options.get('version'));
    });
});

/**
 * @param item
 * @param selector
 */
function matchClickToTitle (item, selector) {
    item.getText().then(function (text) {
        return item.click().then(function () {
            element(by.css(selector))
                .getText()
                .then(function (texts) {
                    assert.equal(texts, text);
                });
        });
    });
}