describe("Module: History", function () {

    var scope, element, compile, clock;

    beforeEach(module("BrowserSync"));
    beforeEach(module("test.templates"));

    describe("When using the history module", function () {

        var Location, rootScope, isolatedScope;
        beforeEach(inject(function (_Location_, $rootScope) {
            Location = _Location_;
            rootScope = $rootScope;
        }));
        it("has reloadAll method", function () {
            assert.isFunction(Location.refreshAll);
        });
        it("has sendAllto method", function () {
            assert.isFunction(Location.sendAllTo);
        });
    });
});