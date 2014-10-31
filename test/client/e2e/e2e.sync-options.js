/**
 *
 * E2E tests for the sync-options plugin
 *
 */
describe('Sync options section', function() {

    var expected, selector, menu, bsUrl;
    var ptor = protractor.getInstance();
    var url;

    beforeEach(function () {
        browser.ignoreSynchronization = true;
        browser.get("/sync-options");
        bsUrl     = process.env["BS_URL"];
    });

    it("should list the sync options", function () {

        selector  = '(key, value) in syncItems';

        var elements = element.all(by.repeater(selector));

        elements.count().then(function (count) {
            expect(count).toEqual(2);
        });
    });
    it("should list the form sync options", function () {

        selector  = 'item in formItems';

        var elements = element.all(by.repeater(selector));

        elements.count().then(function (count) {
            expect(count).toEqual(3);
        });
    });
});