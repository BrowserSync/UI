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
    }));

    afterEach(function () {
        socket.on.restore();
    });

    it("should be available", function () {
        assert.isDefined(mainCtrl);
    });
    it("should have an empty options object", function () {
        assert.isDefined(scope.options);
    });
    it("should have an empty browsers object", function () {
        assert.isDefined(scope.browsers);
    });
    it("should have a socket id property", function () {
        assert.isDefined(scope.socketId);
    });
    it("should have a socketEvents object on the scope", function () {
        assert.isDefined(scope.socketEvents);
    });
    it("should have a socketEvents.connection callback", function () {
        assert.isDefined(scope.socketEvents.connection);
    });
    it("should add the connection event", function () {
        sinon.assert.calledWithExactly(spy, "connection", scope.socketEvents.connection);
    });
    it("should set options on the scope", function () {
        var options  = { name: "kittens" };
        scope.socketEvents.connection(options);
        var actual = scope.options.name;
        var expected = "kittens";
        assert.equal(actual, expected);
    });
    it("should set the Server mode on the options", function () {
        var options  = { server: "test/fixtures" };
        scope.socketEvents.connection(options);
        var actual = scope.options.mode;
        var expected = "Server";
        assert.equal(actual, expected);
    });
    it("should set the Proxy mode on the options", function () {
        var options  = { proxy: "local.dev" };
        scope.socketEvents.connection(options);
        var actual = scope.options.mode;
        var expected = "Proxy";
        assert.equal(actual, expected);
    });
    it("should set the Snippet mode on the options", function () {
        var options  = {};
        scope.socketEvents.connection(options);
        var actual = scope.options.mode;
        var expected = "Snippet";
        assert.equal(actual, expected);
    });
});