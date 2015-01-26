/**
 * Remote debug page
 */
var assert = require("chai").assert;
var init  = require("./../bs-init");
var utils  = require("./../test-utils");

describe("Remote debug page", function() {

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
    });

    it("should allow elements to be added/removed from clients via the UI", function() {

        var id = bs.instance.options.getIn(["clientFiles", "pesticide", "id"]);
        browser.get(cpUrl + "/remote-debug");
        browser.sleep(1000);

        element.all(by.css("label[for='cmn-form-pesticide']")).get(0).click();

        utils.openWindow(browser, bsUrl);

        browser.getAllWindowHandles().then(function (handles) {
            var ui     = handles[0];
            var client = handles[1];
            browser.switchTo().window(client);
            expect(element(by.id(id)).isPresent()).toBeTruthy();
            browser.sleep(500);
            browser.switchTo().window(ui);
            element.all(by.css("label[for='cmn-form-pesticide']")).get(0).click();
            browser.switchTo().window(client);
            browser.sleep(500);
            expect(element(by.id(id)).isPresent()).toBeFalsy();
            browser.close();
        });
    });
});