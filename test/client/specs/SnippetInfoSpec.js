describe("Directive: Snippet info", function () {

    var scope, element, compile;
    beforeEach(module("BrowserSync"));

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

            // Set the user on the parent scope to simulate how it'd happen in your app
            // Pass in the user object to the directive
            element = angular.element("<snippet-info options=\"options\"></snippet-info>");

            // Compile & Digest as normal
            compile(element)(scope);
            scope.$digest();
        });

        it("Should not be shown be default", function () {
            var localScope = scope.$$childHead;
            assert.equal(localScope.ui.snippet, false);
        });

        it("should be shown when toggle", function () {
            var localScope = scope.$$childHead;
            localScope.toggleSnippet();
            assert.equal(localScope.ui.snippet, true);
        });
    });
});