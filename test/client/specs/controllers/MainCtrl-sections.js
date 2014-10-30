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
        mainCtrl = $controller("MainCtrl", {
            $scope: scope
        });
        scope.$digest();
    }));
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