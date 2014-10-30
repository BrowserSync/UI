describe("Directive: Plugins", function () {

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

    describe("Enable/disable plugins", function () {

        var socket, rootScope, spy;

        beforeEach(inject(function ($injector, $rootScope) {

            rootScope = $rootScope;
            socket    = $injector.get("Socket");
            spy       = sinon.spy(socket, "emit");

            // Set the user on the parent scope to simulate how it'd happen in your app
            scope.options = {
                server: {
                    baseDir: "./"
                },
                userPlugins: [
                    {
                        name: "Html Injector",
                        active: true
                    },
                    {
                        name: "Control Panel",
                        active: true
                    }
                ]
            };

            // Pass in the user object to the directive
            element = angular.element("<plugin-list options=\"options\"></plugin-list>");

            // Compile & Digest as normal
            compile(element)(scope);
            scope.$digest();
        }));
        it("renders the correct markup elements", function () {
            var listElem = element.find("ul").find("li");
            assert.equal(listElem.length, 1);
            assert.isTrue(listElem.find("input")[0].checked);
        });
        it("excludes the control panel from the plugin menu", function () {
            var isolatedScope = scope.$$childHead;
            assert.equal(isolatedScope.ui.plugins.length, 1);
            assert.equal(isolatedScope.ui.plugins[0].name, "Html Injector");
        });
        it("emits plugins:configure event", function () {
            var isolatedScope = scope.$$childHead;
            isolatedScope.togglePlugin("PLUGIN");
            sinon.assert.calledWithExactly(spy, "plugins:configure", "PLUGIN");
        });
    });
});