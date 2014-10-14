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

        var socket, rootScope;

        beforeEach(inject(function (Socket, $rootScope) {

            socket = Socket;
            rootScope = $rootScope;

            // Pass in the user object to the directive
            element = angular.element("<notify-elem></notify-elem>");

            // Compile & Digest as normal
            compile(element)(scope);
            scope.$digest();
        }));
        it("has ui properties", function () {
            assert.isDefined(scope.ui.visible);
            assert.isDefined(scope.ui.status);
            assert.isDefined(scope.ui.heading);
            assert.isDefined(scope.ui.message);
        });
        it("can be activated with only a message", function () {
            scope.show({}, {
                message: "Hi there"
            });
            assert.isTrue(scope.ui.visible);
            assert.equal(scope.ui.message, "Hi there");
            assert.equal(scope.ui.status, "info");
        });
        it("can be activated with a status", function () {
            scope.show({}, {
                message: "Hi there",
                status: "error"
            });
            assert.isTrue(scope.ui.visible);
            assert.equal(scope.ui.message, "Hi there");
            assert.equal(scope.ui.status, "error");
        });
        it("can be activated with a heading", function () {
            scope.show({}, {
                message: "Hi there",
                status: "error",
                heading: "SORRY!!!"
            });
            assert.equal(scope.ui.heading, "SORRY!!!");
        });
        it("can be deactivated after default timeout", function () {
            scope.show({}, {
                message: "Hi there"
            });
            clock.tick(3000);
            assert.equal(scope.ui.visible, false);
        });
        it("can be deactivated after given timeout", function () {
            scope.show({}, {
                message: "Hi there",
                timeout: 5000
            });
            clock.tick(5010);
            assert.equal(scope.ui.visible, false);
        });
        it("overide current message", function () {
            scope.show({}, {
                message: "Hi there"
            });
            clock.tick(1000);
            scope.show({}, {
                message: "Shane"
            });
            clock.tick(1900);
            assert.equal(scope.ui.message, "Shane");
        });
    });
});