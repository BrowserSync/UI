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
        browser.get("/history");
        bsUrl     = process.env["BS_URL"];
    });
    it("should list visited urls", function () {

        var elems;
        openWindow(ptor, bsUrl);

        browser.getAllWindowHandles().then(function (handles) {

            browser.switchTo().window(handles[1]);
            browser.get(bsUrl + "/scrolling.html");

            browser.switchTo().window(handles[0]);
            elems = element.all(by.repeater('url in urls.visited'));
            expect(elems.count()).toEqual(2);
        });
    });
});

function openWindow (ptor, url) {
    ptor.executeScript("window.open('%s')".replace("%s", url));
}