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
    beforeEach(function () {
        browser.ignoreSynchronization = true;
        browser.get(process.env["BS_CP"]);
    });
    it('should render the correct amount of links', function() {

        var expected  = 4;
        var selector  = '(key, item) in ui.menu | orderObjectBy: \'order\'';

        expect(element(by.id('bs-section-nav')).isPresent()).toBeTruthy();

        element.all(by.repeater(selector)).then(function (elems) {
            expect(elems.length).toEqual(expected);
        });
    });
});