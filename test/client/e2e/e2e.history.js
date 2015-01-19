/**
 *
 * E2E tests for the History plugin
 *
 */
describe("History section", function() {

    var ptor = protractor.getInstance();

    beforeEach(function () {
        browser.ignoreSynchronization = true;
    });

    it("should list visited urls", function () {

        var flow = protractor.promise.controlFlow();
        var deferred = protractor.promise.defer();

        var bs = require("browser-sync").create("Test Instance");

        bs.use(require("../../../"));

        flow.execute(function () {

            bs.init({
                server: "./test/fixtures",
                open: false,
                online: false
            }, function (err, _bs) {
                _bs.pluginManager.getReturnValues("UI")[0].value
                    .getServer(function (err, server) {
                        deferred.fulfill(server.address().port);
                    });
            });

            return deferred.promise;

        }).then(function (port) {

            var options = bs.instance.options;
            var bsUrl   = options.getIn(["urls", "local"]);
            var url     = "http://localhost:" + port;
            var elems   = element.all(by.repeater("url in visited track by $index"));

            browser.get(url + "/history");

            expect(elems.count()).toEqual(0);

            openWindow(ptor, bsUrl);

            browser.getAllWindowHandles().then(function (handles) {

                var ui     = handles[0];
                var client = handles[1];

                browser.switchTo().window(client);
                browser.get(bsUrl + "/scrolling.html");
                browser.switchTo().window(ui);
                expect(elems.count()).toEqual(2);
                browser.switchTo().window(client);
                browser.get(bsUrl + "/forms.html");
                browser.switchTo().window(ui);
                expect(elems.count()).toEqual(3);

                //ptor.pause();

                var selector      = by.css("#bs-history-list li > [bs-remove]");
                var deleteButtons = element.all(selector);

                expect(element.all(by.css("#bs-history-empty")).count()).toBe(0);

                deleteButtons.get(0).click();

                expect(elems.count()).toEqual(2);

                browser.sleep(1000);

                deleteButtons.get(0).click();

                expect(elems.count()).toEqual(1);

                browser.sleep(1000);

                deleteButtons.get(0).click();

                browser.sleep(500);

                expect(elems.count()).toEqual(0);

                expect(element.all(by.css("#bs-history-list li")).count()).toBe(0);

                expect(element.all(by.css("#bs-history-empty")).count()).toBe(1);
            });
        });
    });
});

/**
 * @param ptor
 * @param url
 */
function openWindow (ptor, url) {
    ptor.executeScript("window.open('%s')".replace("%s", url));
}