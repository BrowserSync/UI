"use strict";

describe("Main Controller", function () {

    beforeEach(module("BrowserSync"));

    var mainCtrl;
    var scope;
    var sections;
    var values;
    var config;


    beforeEach(inject(function ($rootScope, $controller, $injector) {
        config = {
            urls: {
                local:    "http://localhost:3000",
                external: "http://192.168.0.1:3000"
            }
        };
        scope = $rootScope.$new();
        sections = $injector.get("ContentSections");
        values = $injector.get("contentSections");
        mainCtrl = $controller("MainCtrl", {
            $scope: scope
        });
        scope.$digest();
    }));
    it("should set the server-info title based on the options (SERVER)", function () {
        config.server = true;
        scope.update(config);
        assert.equal(scope.ui.menu["server-info"].title,   "Server Info");
    });
    it("should set the server-info title based on the options (PROXY)", function () {
        config.proxy = true;
        scope.socketEvents.connection(config);
        assert.equal(scope.ui.menu["server-info"].title,   "Proxy Info");
    });
    it("should set the server-info title based on the options (SNIPPET)", function () {
        var options  = {};
        scope.socketEvents.connection(options);
        assert.equal(scope.ui.menu["server-info"].title,   "Snippet Info");
    });
});