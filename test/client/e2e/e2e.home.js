/**
 *
 *
 */

var assert = require("chai").assert;

describe('Section Navigation', function() {

    var expectedItems, selector, menu, headerSelector
    var ptor = protractor.getInstance();

    beforeEach(function () {
        browser.ignoreSynchronization = true;
        browser.get("/");
        expectedItems  = 4;
        selector       = '(key, item) in ui.menu | orderObjectBy: \'order\'';
        headerSelector = "[bs-content] h1";
    });
    /**
     *
     * Check that the menu is rendered with the correct amount
     * of links/sections
     *
     */
    it('should render the correct amount of links', function() {

        element.all(by.repeater(selector)).then(function (elems) {

            // Check the correct amount of links
            expect(elems.length).toEqual(expectedItems);

            // Check the text of the first item matches
            elems[0].getText().then(function (name) {
               expect(name).toEqual("Server Info");
            });
        });
    });

    /**
     *
     * Check that a display url is present in the input underneath the header
     *
     */
    it('should render the URL in the input under header', function() {
        var input = element(by.model('options.displayUrl'));
        expect(input.getAttribute('value')).toBe(process.env["BS_URL"]);
    });

    /**
     *
     * Check that each menu item has an icon element
     * of links/sections
     *
     */
    it('should render an icon for each link item', function() {

        // Get all the items
        element.all(by.repeater(selector)).then(function (elems) {
            elems.forEach(function (item) {
                item.getInnerHtml().then(function (html) {
                    // check the item's inner HTML to ensure icon is present
                    var match = html.match(/ bs-icon="(.+?)"/ig);
                    assert.isNotNull(match);
                });
            })
        });
    });

    /**
     *
     * Check that when a side-bar item is clicked,
     * The header of the main section is updated correctly
     * Meaning that the section was swapped as you intend
     *
     */
    it("should switch to server info section", function () {
        var menuItem = element.all(by.repeater(selector)).get(0);
        matchClickToTitle(menuItem, headerSelector);
    });
    it("should switch to Sync options section", function () {
        var menuItem = element.all(by.repeater(selector)).get(1);
        matchClickToTitle(menuItem, headerSelector);
    });
    it("should switch to History section", function () {
        var menuItem = element.all(by.repeater(selector)).get(2);
        matchClickToTitle(menuItem, headerSelector);
    });
    it("should switch to Plugins section", function () {
        var menuItem = element.all(by.repeater(selector)).get(3);
        matchClickToTitle(menuItem, headerSelector);
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