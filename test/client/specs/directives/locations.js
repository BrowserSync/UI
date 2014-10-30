describe.only("Directive: Locations", function () {

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

    describe("Syncing URLS", function () {

        var socket, rootScope;

        beforeEach(inject(function (Socket, $rootScope) {

            socket = Socket;
            rootScope = $rootScope;

            // Set the user on the parent scope to simulate how it'd happen in your app
            scope.options = {
                server: {
                    baseDir: "./"
                },
                "urls": {
                    "local": "http://localhost:3000",
                    "external": "http://192.168.0.2:3000"
                }
            };

            // Pass in the user object to the directive
            element = angular.element("<locations options=\"options\"></locations>");

            // Compile & Digest as normal
            compile(element)(scope);
            scope.$digest();
        }));

        it("has all loaders disabled on load", function () {
            var isolatedScope = scope.$$childHead;
            assert.isFalse(isolatedScope.ui.loaders.reloadAll);
            assert.isFalse(isolatedScope.ui.loaders.sendAllTo);
        });

        it("shows loader for reloadAll()", function () {
            var isolatedScope = scope.$$childHead;
            isolatedScope.reloadAll();
            assert.isTrue(isolatedScope.ui.loaders.reloadAll);
            clock.tick(600);
            assert.isFalse(isolatedScope.ui.loaders.reloadAll);
        });

        it("shows loader for reloadAll()", function () {
            var isolatedScope = scope.$$childHead;
            isolatedScope.sendAllTo("/forms", "sendAllTo");
            assert.isTrue(isolatedScope.ui.loaders.sendAllTo);
            clock.tick(600);
            assert.isFalse(isolatedScope.ui.loaders.sendAllTo);
        });
    });
});