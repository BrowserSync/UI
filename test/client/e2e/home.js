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

describe('angularjs homepage todo list', function() {
    it('should add a todo', function() {
        browser.ignoreSynchronization = true;
        browser.get(process.env["BS_CP"]);
        expect(element(by.id('section-nav')).isPresent()).toBeTruthy();
    });
});