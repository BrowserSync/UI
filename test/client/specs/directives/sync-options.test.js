describe("Directive: Sync options", function () {

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
                urls: {
                    local: "http://localhost:3000"
                },
                ghostMode: {
                    clicks: true,
                    scroll: true,
                    forms: {
                        toggle: true,
                        submit: true
                    }
                }
            };

            // Pass in the user object to the directive
            element = angular.element("<sync-options options=\"options\"></sync-options>");

            // Compile & Digest as normal
            compile(element)(scope);
            scope.$digest();
        });

        it("set's up the data for rendering", function () {
            var isolatedScope = scope.$$childHead;
            var syncItems = isolatedScope.syncItems;

            assert.equal(syncItems[0].title, "Clicks");
            assert.equal(syncItems[1].title, "Scroll");
            assert.equal(syncItems[0].value, true);
            assert.equal(syncItems[1].value, true);

            var formItems = isolatedScope.formItems;
            assert.equal(formItems[0].title, "Toggle");
            assert.equal(formItems[1].title, "Submit");
        });
    });
});