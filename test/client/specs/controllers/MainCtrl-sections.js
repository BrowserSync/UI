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
        scope.ui.sectionMenu = true;
        scope.setActiveSection(scope.ui.menu["ghostmode"]);
        assert.equal(scope.ui.sectionMenu, false);

        assert.equal(scope.ui.menu["ghostmode"].active,   true);
        assert.equal(scope.ui.menu["server-info"].active, false);
        assert.equal(scope.ui.menu["locations"].active,   false);
    });
    it("should set the server-info title based on the options (SERVER)", function () {
        var options  = { server: {} };
        scope.socketEvents.connection(options);
        assert.equal(scope.ui.menu["server-info"].title,   "Server Info");
    });
    it("should set the server-info title based on the options (PROXY)", function () {
        var options  = { proxy: {} };
        scope.socketEvents.connection(options);
        assert.equal(scope.ui.menu["server-info"].title,   "Proxy Info");
    });
    it("should set the server-info title based on the options (SNIPPET)", function () {
        var options  = {};
        scope.socketEvents.connection(options);
        assert.equal(scope.ui.menu["server-info"].title,   "Snippet Info");
    });
});