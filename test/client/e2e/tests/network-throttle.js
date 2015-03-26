/**
 * Remote debug page
 */
var assert = require("chai").assert;
var init  = require("./../bs-init");
var utils  = require("./../test-utils");

describe("Network throttle page", function() {

    var bs;
    var ui;
    var bsUrl;
    var cpUrl;

    beforeEach(function () {

        browser.ignoreSynchronization = true;

        init(protractor, {
            server: "./test/fixtures",
            logLevel: "silent",
            open:   false,
            online: false
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

    it("should allow elements to be added/removed from clients via the UI", function() {

        var id = ui.getOptionIn(["clientFiles", "pesticide", "id"]);

        browser.get(cpUrl + "/network-throttle");
        browser.sleep(1000);

        var items = element.all(by.repeater("(key, target) in ctrl.throttle.targets | orderObjectBy:'order'"));

        expect(items.count()).toBe(4);

        var firstSwitch = by.css("label[for=cmn-form-dsl]");

        expect(element(firstSwitch).isPresent()).toBeTruthy();

        element(firstSwitch).click();

        browser.sleep(2000);

        var flow     = protractor.promise.controlFlow();

        flow.execute(function () {

            assert.isDefined(ui.servers["dsl"]);
            assert.isDefined(ui.servers.dsl.server);
            assert.isDefined(ui.servers.dsl.port);

            var port = ui.servers.dsl.port;

            var urlSelector = by.repeater("url in target.urls");

            expect(element.all(urlSelector).count()).toBe(1);
            expect(element.all(urlSelector).get(0).getText()).toContain(":" + port);
            element.all(urlSelector)
                .get(0)
                .getText()
                .then(function (url) {
                    utils.openWindow(browser, url);
                });

            browser.sleep(1000);

            browser.getAllWindowHandles().then(function (handles) {
                var ui     = handles[0];
                var client = handles[1];
                browser.switchTo().window(client);
                expect(element(by.id("__bs_script__")).isPresent()).toBeTruthy();
            });
        });
    });
});