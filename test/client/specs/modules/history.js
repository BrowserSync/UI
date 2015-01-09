describe("Module: History", function () {

    beforeEach(module("BrowserSync"));
    beforeEach(module("test.templates"));

    describe("When using the history module", function () {

        var Location, rootScope, Socket;
        beforeEach(inject(function (_Location_, $rootScope, _Socket_, $q) {
            Location  = _Location_;
            Socket    = _Socket_;
            rootScope = $rootScope;
            var deferred = $q.defer();
            deferred.resolve(["/", "/scrolling.html"]);
            sinon.stub(Socket, "getData").returns(deferred.promise);
        }));
        afterEach(function () {
            Socket.getData.restore();
        });
        it("has reloadAll method", function () {
            assert.isFunction(Location.refreshAll);
        });
        it("has sendAllto method", function () {
            assert.isFunction(Location.sendAllTo);
        });
        it("can track history and return an array", function () {
            Location.getHistory().then(function (out) {
                assert.equal(out.length, 2);
            });
            rootScope.$digest();
        });
    });
});