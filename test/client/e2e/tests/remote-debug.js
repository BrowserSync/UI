/**
 * Remote debug page
 */
var assert = require("chai").assert;
var init  = require("./../bs-init");
var utils  = require("./../test-utils");

describe("Remote debug page", function() {

    var bs;
    var cp;
    var bsUrl;
    var cpUrl;
    var port;

    beforeEach(function () {

        browser.ignoreSynchronization = true;

        init(protractor, {
            server: "./test/fixtures",
            open:   false,
            online: false
        }).then(function (out) {
            port  = out.port;
            bs    = out.bs.instance;
            cp    = out.cp;
            bsUrl = bs.options.getIn(["urls", "local"]);
            cpUrl = "http://localhost:" + out.cp.server.address().port;
        });
    });

    afterEach(function () {
        bs.cleanup();
    });

    it("should allow elements to be added/removed from clients via the UI", function() {

        var id = cp.getOptionIn(["clientFiles", "pesticide", "id"]);
        browser.get(cpUrl + "/remote-debug");
        browser.sleep(1000);
        var button = element.all(by.css("label[for='cmn-form-pesticide']"));

        button.get(0).click();

        utils.openWindow(browser, bsUrl);

        browser.getAllWindowHandles().then(function (handles) {
            var ui     = handles[0];
            var client = handles[1];
            browser.switchTo().window(client);
            expect(element(by.id(id)).isPresent()).toBeTruthy();
            browser.sleep(500);
            browser.switchTo().window(ui);
            button.get(0).click();
            browser.switchTo().window(client);
            browser.sleep(500);
            expect(element(by.id(id)).isPresent()).toBeFalsy();
            browser.close();
        });
    });
});