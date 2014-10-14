"use strict";

describe("Main Controller - Handling disconnections", function () {

    beforeEach(module("BrowserSync"));

    var mainCtrl;
    var scope;
    var socket;
    var spy;

    beforeEach(inject(function ($rootScope, $controller, $injector) {
        scope = $rootScope.$new();
        socket = $injector.get("Socket");
        spy = sinon.spy(socket, "addEvent");
        mainCtrl = $controller("MainCtrl", {
            $scope: scope
        });
    }));

    afterEach(function () {
        socket.addEvent.restore();
    });

    it("should have a ui.disconnect property set at false", function () {
        assert.isFalse(scope.ui.disconnected);
    });
    it("should set the ui.disconnect property to true after event", function () {
        scope.socketEvents.disconnect();
        assert.isTrue(scope.ui.disconnected);
    });
    it("should set the ui.disconnect property back to false following re-connection", function () {
        scope.socketEvents.connection({});
        assert.isFalse(scope.ui.disconnected);
    });
});