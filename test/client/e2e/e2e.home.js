/**
 *
 NONE Angular site
 browser.ignoreSynchronization = true;
 browser.get('http://localhost:8000/login.html');

 element(by.id('username')).sendKeys('Jane');
 element(by.id('password')).sendKeys('1234');
 element(by.id('clickme')).click();
 *
 */

describe('Section Navigation', function() {

    var expected, selector, menu;
    var ptor = protractor.getInstance();

    beforeEach(function () {
        browser.ignoreSynchronization = true;
        browser.get("/");
        expected  = 4;
        selector  = '(key, item) in ui.menu | orderObjectBy: \'order\'';
    });
    /**
     *
     * Check that the menu is rendered with the correct amount
     * of links/sections
     *
     */
    it('should render the correct amount of links', function() {

        // Assert the navigation exists
        expect(element(by.id('bs-section-nav')).isPresent()).toBeTruthy();

        element.all(by.repeater(selector)).then(function (elems) {

            // Check the correct amount of links
            expect(elems.length).toEqual(expected);

            // Check the text of the first item matches
            elems[0].getText().then(function (name) {
               expect(name).toEqual("Server Info");
            });
        });
    });

    /**
     *
     * Check that when a side-bar item is clicked,
     * The header of the main section is updated correctly
     *
     */
    it("should switch sections", function () {

        // get the second item in the menu
        var menuItem = element(by.repeater(selector).row(2));

        menuItem.getText().then(function (menuTitle) {

            // Click the menu button
            menuItem.click();

            element(by.css(".bs-main-section h1"))
                // Get the main heading and check it
                .getText()
                // Assert that it matches the text of the button was clicked
                .then(function (headerTitle) {
                    expect(menuTitle).toEqual(headerTitle);
            });
        });
    });
});