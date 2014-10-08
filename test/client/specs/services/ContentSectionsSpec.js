"use strict";

describe("Content Sections Value/Service", function () {

    beforeEach(module("BrowserSync"));

    var sections;
    var values;

    beforeEach(inject(function ($rootScope, $controller, $injector) {
        sections = $injector.get("ContentSections");
        values = $injector.get("contentSections");
        // reset
        values["server-info"].active = true;
        values["ghostmode"].active = false;
        values["locations"].active = false;
    }));

    it("should have default state", function () {
        assert.equal(values["server-info"].active, true);
        assert.equal(values["ghostmode"].active, false);
        assert.equal(values["locations"].active, false);
    });
    it("should enable a section & disable all others", function () {
        sections.enable(values["ghostmode"]);
        assert.equal(values["server-info"].active, false);
        assert.equal(values["ghostmode"].active, true);
        assert.equal(values["locations"].active, false);
    });
    it("should be able to transform a value", function () {
        var transformed = sections.transform(values["ghostmode"], function (item) {
            item.title = "Shane";
            return item;
        });
        assert.equal(values["ghostmode"].title, "Shane");
    });
});