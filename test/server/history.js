var Immutable = require("immutable");
var history   = require("../../server/plugins/history/history");
var assert    = require("chai").assert;

describe.only("Saving history", function () {
    it("Adding a new path", function () {
        var imm = Immutable.OrderedSet('/');
        var out = history.addPath(imm, "http://localhost/shane");
        assert.deepEqual(out.toJS(), ["/", "/shane"]);
    });
    it("Adding a dupe path", function () {
        var imm = Immutable.OrderedSet('/');
        var out = history.addPath(imm, "http://localhost/");
        assert.deepEqual(out.toJS(), ["/"]);
    });
    it("Can remove a path", function () {
        var imm = Immutable.OrderedSet(['/', "/shane"]);
        var out = history.removePath(imm, "http://localhost/");
        assert.deepEqual(out.toJS(), ["/shane"]);
    });
});