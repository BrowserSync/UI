"use strict";

describe("Content Sections Value/Service", function () {

    beforeEach(module("BrowserSync"));

    var sections;
    var values;

    beforeEach(inject(function ($rootScope, $controller, $injector) {
        sections = $injector.get("ContentSections");
        values = $injector.get("contentSections");
    }));
    it("should be able to transform a value", function () {
        sections.transform(values["history"], function (item) {
            item.title = "Shane";
            return item;
        });
        assert.equal(values["history"].title, "Shane");
    });
});