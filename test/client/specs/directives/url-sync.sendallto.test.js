describe("Directive: url-sync.sendAllTo()", function () {

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

    describe("Syncing Browsers to a URL", function () {

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
                    "external": "http://192.168.0.2:3000",
                    "tunnel": "https://trjjcleffl.localtunnel.me"
                }
            };

            // Pass in the user object to the directive
            element = angular.element("<history-list options=\"options\"></history-list>");

            // Compile & Digest as normal
            compile(element)(scope);
            scope.$digest();
        }));
        it("should have the url property at start, but be empty", function () {
            var isolatedScope = scope.$$childHead;
            assert.deepEqual(isolatedScope.urls.current, "");
        });
        it.skip("has the sendAllTo() method", function () {
            var isolatedScope = scope.$$childHead;
            assert.deepEqual(typeof isolatedScope.sendAllTo, "function");
        });
        it.skip("Emits the browser:url event", function () {

            var isolatedScope = scope.$$childHead;

            var stub = sinon.spy(socket, "emit");

            isolatedScope.ui.current = "about-us.html";

            isolatedScope.sendAllTo("about-us.html");

            assert.equal(isolatedScope.ui.loading, true);

            assert.equal(isolatedScope.urls.current, "");

            sinon.assert.calledWithExactly(stub, "urls:browser:url", {
                path: "about-us.html"
            });

            clock.tick(600);

            assert.equal(isolatedScope.ui.loading, false);

            stub.reset();
        });
        it("populates the dropdown of visited urls", function () {

            var isolatedScope = scope.$$childHead;

            isolatedScope.updateVisited([{
                path: "/"
            }]);

            assert.equal(isolatedScope.urls.visited.length, 1);

            isolatedScope.updateVisited([
                {
                    path: "/"
                },
                {
                    path: "/index.html"
                }
            ]);

            var lis = element.find("ul").find("li");
            assert.equal(isolatedScope.urls.visited.length, 2);
            assert.equal(lis.length, 2);
        });
    });
});