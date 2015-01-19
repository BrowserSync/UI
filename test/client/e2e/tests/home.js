/**
 *
 *
 */

var assert = require("chai").assert;
var init  = require("./../bs-init");
var utils = require("./../test-utils");

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
        headerSelector = "[bs-content] h1";

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
    });

    ///**
    // *
    // * Check that a display url is present in the input underneath the header
    // *
    // */
    //it('should render the URL in the input under header', function() {
    //    var input = element(by.model('options.displayUrl'));
    //    expect(input.getAttribute('value')).toBe(process.env["BS_URL"]);
    //});
    //
    ///**
    // *
    // * Check that each menu item has an icon element
    // * of links/sections
    // *
    // */
    //it('should render an icon for each link item', function() {
    //
    //    // Get all the items
    //    element.all(by.repeater(selector)).then(function (elems) {
    //        elems.forEach(function (item) {
    //            item.getInnerHtml().then(function (html) {
    //                // check the item's inner HTML to ensure icon is present
    //                var match = html.match(/ bs-icon="(.+?)"/ig);
    //                assert.isNotNull(match);
    //            });
    //        })
    //    });
    //});
    //
    ///**
    // *
    // * Check that when a side-bar item is clicked,
    // * The header of the main section is updated correctly
    // * Meaning that the section was swapped as you intend
    // *
    // */
    //it("should switch to server info section", function () {
    //    var menuItem = element.all(by.repeater(selector)).get(0);
    //    matchClickToTitle(menuItem, headerSelector);
    //});
    //it("should switch to Sync options section", function () {
    //    var menuItem = element.all(by.repeater(selector)).get(1);
    //    matchClickToTitle(menuItem, headerSelector);
    //});
    //it("should switch to History section", function () {
    //    var menuItem = element.all(by.repeater(selector)).get(2);
    //    matchClickToTitle(menuItem, headerSelector);
    //});
    //it("should switch to Plugins section", function () {
    //    var menuItem = element.all(by.repeater(selector)).get(3);
    //    matchClickToTitle(menuItem, headerSelector);
    //});
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