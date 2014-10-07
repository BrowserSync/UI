describe("Directive: URL Info", function () {

    var scope, element, compile;
    beforeEach(module("BrowserSync"));
    beforeEach(module("test.templates"));

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($compile, $rootScope) {
        scope = $rootScope;
        compile = $compile;
    }));

    describe("Rendering the top title bar with URL info for server", function () {
        beforeEach(function () {

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
            element = angular.element("<url-info options=\"options\"></url-info>");

            // Compile & Digest as normal
            compile(element)(scope);
            scope.$digest();
        });

        it("should render the correct amount of links", function () {
            var actual = element.find("li");
            var links  = actual.find("a");

            assert.equal(links[0].href, "http://localhost:3000/");
            assert.equal(links[1].href, "http://192.168.0.2:3000/");
            assert.equal(links[2].href, "https://trjjcleffl.localtunnel.me/");
            assert.equal(actual.length, 3);
        });
    });
    describe("Rendering the top title bar with URL info for proxy", function () {
        beforeEach(function () {

            // Set the user on the parent scope to simulate how it'd happen in your app
            scope.options = {
                "proxy": {
                    "protocol": "http",
                    "host": "swoon.static",
                    "port": 80,
                    "target": "http://swoon.static",
                    "startPath": "store-home.php"
                },
                "urls": {
                    "local": "http://localhost:3000",
                    "external": "http://192.168.0.2:3000"
                }
            };

            // Pass in the user object to the directive
            element = angular.element("<url-info options=\"options\"></url-info>");

            // Compile & Digest as normal
            compile(element)(scope);
            scope.$digest();
        });

        // This test will fail as we're looking at the parent scope here & not the directives' 'isolated' scope.
        it("should render the correct text with Proxy", function () {

            var actual = element.find("li");
            var links  = actual.find("a");

            assert.equal(links[0].href, "http://localhost:3000/");
            assert.equal(links[1].href, "http://192.168.0.2:3000/");
            assert.equal(actual.length, 2);
        });
    });
});