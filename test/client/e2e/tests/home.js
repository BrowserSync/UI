/**
 *
 *
 */

var assert = require("chai").assert;
var init  = require("./../bs-init");

describe("Section Navigation", function() {

    var selector, menu, headerSelector;

    var bs;
    var cp;
    var bsUrl;
    var cpUrl;
    var port;

    beforeEach(function () {

        browser.ignoreSynchronization = true;
        selector       = '(key, item) in app.ui.menu | orderObjectBy: \'order\'';
        headerSelector = "h1[bs-heading]";

        init(protractor, {
            server: "./test/fixtures",
            open:   false,
            online: false
        }).then(function (out) {
            port  = out.port;
            bs    = out.bs;
            cp    = out.cp;
            bsUrl = bs.instance.options.getIn(["urls", "local"]);
            cpUrl = "http://localhost:" + out.cp.server.address().port;
        });
    });

    afterEach(function () {
        bs.instance.cleanup();
        cp.server.close();
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
        expect(elems.get(0).getText()).toBe("Server Info");
        expect(elems.get(1).getText()).toBe("Sync Options");
        expect(elems.get(2).getText()).toBe("History");
        expect(elems.get(3).getText()).toBe("Connections");
        expect(elems.get(4).getText()).toBe("Plugins");
        expect(elems.get(5).getText()).toBe("Remote Debug");
        matchClickToTitle(elems.get(0), headerSelector);
        matchClickToTitle(elems.get(1), headerSelector);
        matchClickToTitle(elems.get(2), headerSelector);
        matchClickToTitle(elems.get(3), headerSelector);
        matchClickToTitle(elems.get(4), headerSelector);
        matchClickToTitle(elems.get(5), headerSelector);

        elems.get(0).click(); // back to homepage
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