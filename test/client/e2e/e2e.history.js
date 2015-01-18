/**
 *
 * E2E tests for the History plugin
 *
 */

describe('History section', function() {

    var expected, selector, menu, bsUrl;
    var ptor = protractor.getInstance();
    var url;

    beforeEach(function () {
        browser.ignoreSynchronization = true;
    });
    afterEach(function () {
    });
    it("should list visited urls", function () {

        var instance;
        var cp;
        var flow = protractor.promise.controlFlow();
        var deferred = protractor.promise.defer();

        var bs = require("browser-sync").create("Test Instance");

        bs.use(require("../../../"));

        flow.execute(function () {

            bs.init({server: "./test/fixtures", open: false, online: false}, function (err, _bs) {
                var cp = _bs.pluginManager.getReturnValues("UI")[0].value;
                cp.getServer(function (err, server) {
                    deferred.fulfill(server);
                });
            });
            return deferred.promise;

        }).then(function (server) {
            var options = bs.instance.options;
            var url = "http://localhost:" + server.address().port;
            browser.get(url + "/history");
            var elems = element.all(by.repeater('url in visited track by $index'));
            expect(elems.count()).toEqual(0);

            var bsUrl = options.getIn(["urls", "local"]);
            openWindow(ptor, bsUrl);

            browser.getAllWindowHandles().then(function (handles) {
                browser.switchTo().window(handles[1]); // client
                browser.get(bsUrl + "/scrolling.html");
                browser.switchTo().window(handles[0]); // ui
                elems = element.all(by.repeater('url in visited track by $index'));
                expect(elems.count()).toEqual(2);
                browser.switchTo().window(handles[1]); // client
                browser.get(bsUrl + "/forms.html");
                browser.switchTo().window(handles[0]); // ui
                elems = element.all(by.repeater('url in visited track by $index'));
                expect(elems.count()).toEqual(3);
            });
        });
    });
});

function openWindow (ptor, url) {
    ptor.executeScript("window.open('%s')".replace("%s", url));
}