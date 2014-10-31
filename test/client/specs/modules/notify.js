describe("Module: Notify", function () {

    var scope, element, compile, clock;
    beforeEach(module("BrowserSync"));
    beforeEach(module("test.templates"));

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($compile, $rootScope) {
        scope = $rootScope;
        compile = $compile;
        clock = sinon.useFakeTimers();
    }));

    after(function () {
        clock.restore();
    });

    describe("When using the notify element", function () {

        var socket, rootScope, isolatedScope;

        beforeEach(inject(function (Socket, $rootScope) {

            socket = Socket;
            rootScope = $rootScope;

            // Pass in the user object to the directive
            element = angular.element("<notify-elem></notify-elem>");

            // Compile & Digest as normal
            compile(element)(scope);
            scope.$digest();
            isolatedScope = scope.$$childHead;
        }));
        it("has ui properties", function () {
            assert.isDefined(isolatedScope.ui.status);
            assert.isDefined(isolatedScope.ui.heading);
            assert.isDefined(isolatedScope.ui.message);
        });
        it("can be activated with only a message", function () {
            isolatedScope.show({}, {
                message: "Hi there"
            });
            assert.isTrue(isolatedScope.ui.visible);
            assert.equal(isolatedScope.ui.message, "Hi there");
            assert.equal(isolatedScope.ui.status, "info");
        });
        it("can be activated with a status", function () {
            isolatedScope.show({}, {
                message: "Hi there",
                status: "error"
            });
            assert.isTrue(isolatedScope.ui.visible);
            assert.equal(isolatedScope.ui.message, "Hi there");
            assert.equal(isolatedScope.ui.status, "error");
        });
        it("can be activated with a heading", function () {
            isolatedScope.show({}, {
                message: "Hi there",
                status: "error",
                heading: "SORRY!!!"
            });
            assert.equal(isolatedScope.ui.heading, "SORRY!!!");
        });
        it("can be deactivated after default timeout", function () {
            isolatedScope.show({}, {
                message: "Hi there"
            });
            clock.tick(3000);
            assert.equal(isolatedScope.ui.visible, false);
        });
        it("can be deactivated after given timeout", function () {
            isolatedScope.show({}, {
                message: "Hi there",
                timeout: 5000
            });
            clock.tick(5010);
            assert.equal(isolatedScope.ui.visible, false);
        });
        it("overide current message", function () {
            isolatedScope.show({}, {
                message: "Hi there"
            });
            clock.tick(1000);
            isolatedScope.show({}, {
                message: "Shane"
            });
            clock.tick(1900);
            assert.equal(isolatedScope.ui.message, "Shane");
        });
    });
});