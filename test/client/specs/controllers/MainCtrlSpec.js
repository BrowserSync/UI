"use strict";

describe("Main Controller", function () {

    beforeEach(module("BrowserSync"));

    var mainCtrl;
    var scope;
    var socket;
    var spy;

    beforeEach(inject(function ($rootScope, $controller, $injector) {
        scope = $rootScope.$new();
        socket = $injector.get("Socket");
        spy = sinon.spy(socket, "on");
        mainCtrl = $controller("MainCtrl", {
            $scope: scope
        });
        scope.$digest();
    }));

    afterEach(function () {
        socket.on.restore();
    });

    it("should be available", function () {
        assert.isDefined(mainCtrl);
    });
    it("should have a socketEvents object on the scope", function () {
        assert.isDefined(mainCtrl.socketEvents);
    });
    it("should have a socketEvents.connection callback", function () {
        assert.isDefined(mainCtrl.socketEvents.connection);
    });
    it("should set options on the scope", function () {
        var options  = { name: "kittens" };
        mainCtrl.socketEvents.connection(options);
        var actual = mainCtrl.options.name;
        var expected = "kittens";
        assert.equal(actual, expected);
    });
});