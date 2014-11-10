describe("Directive: URL Info", function () {

    var scope, element, compile;
    beforeEach(module("BrowserSync"));
    beforeEach(module("test.templates"));

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($compile, $rootScope) {
        scope = $rootScope;
        compile = $compile;
    }));
    describe("Setting up the url data for view rendering", function () {
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

        it("sets up the url data for rendering", function () {
            var isolatedScope = scope.$$childHead;
            var urls          = isolatedScope.urls;

            assert.equal(urls[0].title, "Local");
            assert.equal(urls[0].icon,  "computer_download");
            assert.equal(urls[1].title, "External");
            assert.equal(urls[1].icon,  "wifi_3");
            assert.equal(urls[2].title, "Tunnel");
            assert.equal(urls[2].icon,  "globe");

            assert.isTrue(urls[0].tagline.length > 1);
            assert.isTrue(urls[1].tagline.length > 1);
            assert.isTrue(urls[2].tagline.length > 1);
        });
    });
    describe("Rendering the URL info for server", function () {
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
            var inputs = element.find("input");
            assert.equal(inputs[0].value, "http://localhost:3000");
            assert.equal(inputs[1].value, "http://192.168.0.2:3000");
            assert.equal(inputs[2].value, "https://trjjcleffl.localtunnel.me");
            assert.equal(inputs.length, 3);
        });
    });
    describe("Rendering URL info for proxy", function () {
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

            var inputs = element.find("input");

            assert.equal(inputs[0].value, "http://localhost:3000");
            assert.equal(inputs[1].value, "http://192.168.0.2:3000");
            assert.equal(inputs.length, 2);
        });
    });
});