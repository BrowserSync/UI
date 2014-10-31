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
    it("should list the form sync options", function () {
        element.all(by.css(".bs-main-section ul li")).count().then(function (count) {
            expect(count).toEqual(3);
        });
    });
});