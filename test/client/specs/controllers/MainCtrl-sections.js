"use strict";

describe("Main Controller", function () {

    beforeEach(module("BrowserSync"));

    var mainCtrl;
    var scope;
    var sections;
    var values;

    beforeEach(inject(function ($rootScope, $controller, $injector) {
        scope = $rootScope.$new();
        sections = $injector.get("ContentSections");
        values = $injector.get("contentSections");
        values["server-info"].active = true;
        values["ghostmode"].active   = false;
        values["locations"].active   = false;
        mainCtrl = $controller("MainCtrl", {
            $scope: scope
        });
        scope.$digest();
    }));

    it("should have default state", function () {
        assert.equal(values["server-info"].active, true);
        assert.equal(values["ghostmode"].active,   false);
        assert.equal(values["locations"].active,   false);
    });
    it("should enable a section & disable all others", function () {
        sections.enable(values["ghostmode"]);
        assert.equal(values["server-info"].active, false);
        assert.equal(values["ghostmode"].active,   true);
        assert.equal(values["locations"].active,   false);
    });
    it("should use the contentSections value to set the menu", function () {
        assert.equal(scope.ui.menu["server-info"].active, true);
        assert.equal(scope.ui.menu["ghostmode"].active,   false);
        assert.equal(scope.ui.menu["locations"].active,   false);

        // act
        scope.setActiveSection(scope.ui.menu["ghostmode"]);

        assert.equal(scope.ui.menu["ghostmode"].active,   true);
        assert.equal(scope.ui.menu["server-info"].active, false);
        assert.equal(scope.ui.menu["locations"].active,   false);
    });
});