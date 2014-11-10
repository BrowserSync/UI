"use strict";

describe("Main Controller - Handling disconnections", function () {

    beforeEach(module("BrowserSync"));

    var mainCtrl;
    var scope;
    var socket;
    var rootScope;
    var spy;

    beforeEach(inject(function ($rootScope, $controller, $injector) {
        scope = $rootScope.$new();
        rootScope = $rootScope;
        socket = $injector.get("Socket");
        spy = sinon.spy(socket, "on");
        mainCtrl = $controller("MainCtrl", {
            $scope: scope
        });
    }));

    afterEach(function () {
        socket.on.restore();
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
    it("should respond to connection/disconnect events", function () {
        rootScope.$emit("cp:disconnect");
        assert.isTrue(scope.ui.disconnected);
        rootScope.$emit("cp:connection", {name: "shane"});
        assert.isFalse(scope.ui.disconnected);
        assert.equal(scope.options.name, "shane");
    });
});