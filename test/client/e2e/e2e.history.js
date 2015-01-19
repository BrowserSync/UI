/**
 *
 * E2E tests for the History plugin
 *
 */
var init  = require("./bs-init");
var utils = require("./test-utils");

describe("History section", function() {

    var bs;
    var port;

    beforeEach(function () {
        browser.ignoreSynchronization = true;
        init(protractor, {
            server: "./test/fixtures",
            open:   false,
            online: false
        }).then(function (out) {
            port = out.port;
            bs   = out.bs;
        });
    });

    it("should list visited urls & delete them", function () {

        var options = bs.instance.options;
        var bsUrl   = options.getIn(["urls", "local"]);
        var url     = "http://localhost:" + port;
        var elems   = element.all(by.repeater("url in visited track by $index"));

        browser.get(url + "/history");

        expect(elems.count()).toEqual(0);

        utils.openWindow(browser, bsUrl);

        browser.getAllWindowHandles().then(function (handles) {

            var ui             = handles[0];
            var client         = handles[1];
            var urls           = ["/scrolling.html", "/forms.html"];
            var emptyContainer = "#bs-history-empty";
            var listContainer  = "#bs-history-list";
            var selector       = by.css(listContainer + " li > [bs-remove]");
            var deleteButtons  = element.all(selector);

            browser.switchTo().window(client);
            browser.get(bsUrl + urls[0]);
            browser.switchTo().window(ui);
            expect(elems.count()).toEqual(2);
            browser.switchTo().window(client);
            browser.get(bsUrl + urls[1]);
            browser.switchTo().window(ui);
            expect(elems.count()).toEqual(3);
            expect(element.all(by.css(emptyContainer)).count()).toBe(0);
            deleteButtons.get(0).click();
            expect(elems.count()).toEqual(2);
            browser.sleep(1000);
            deleteButtons.get(0).click();
            expect(elems.count()).toEqual(1);
            browser.sleep(1000);
            deleteButtons.get(0).click();
            browser.sleep(500);
            expect(elems.count()).toEqual(0);
            expect(element.all(by.css(listContainer + " li")).count()).toBe(0);
            expect(element.all(by.css(emptyContainer)).count()).toBe(1);

        }).then(function () {
            bs.instance.cleanup();
        });
    });
});