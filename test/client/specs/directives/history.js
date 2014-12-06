describe("Directive: History", function () {

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
            element = angular.element("<history-list options=\"options\"></history-list>");

            // Compile & Digest as normal
            compile(element)(scope);
            scope.$digest();
        }));

        it("sets the base url as first item in list", function () {

            //console.log(element);

            var isolatedScope = scope.$$childHead;

            isolatedScope.updateVisited([
                {
                    path: "/"
                },
                {
                    path: "scrolling.html"
                },
                {
                    path: "scrolling.html?hello=shane"
                }
            ]);

            assert.equal(isolatedScope.urls.visited[2].path, "scrolling.html?hello=shane");
        });
    });
});