describe("Directive: Snippet info", function () {

    var scope, element, compile;
    beforeEach(module("BrowserSync"));
    beforeEach(module("test.templates"));

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($compile, $rootScope) {
        scope = $rootScope;
        compile = $compile;
    }));

    describe("Using the snippet-info directive", function () {
        beforeEach(function () {

            scope.options = {
                snippet: "SNIPPET"
            };

            element = angular.element("<snippet-info options=\"options\"></snippet-info>");

            // Compile & Digest as normal
            compile(element)(scope);
            scope.$digest();
        });

        it("Should be shown be default", function () {
            var localScope = scope.$$childHead;
            assert.equal(localScope.ui.snippet, true);
        });
    });
});