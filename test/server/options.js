var assert      = require("chai").assert;
var opts        = require("../../server/opts");
var exampleOpts = require("../opts.server.json");

describe("Can create immutable map from bs options", function() {

    var bsInstance;

    before(function () {

    });

    after(function () {

    });

    it.only("can adds the Mode property", function() {
        var options = opts(exampleOpts);
        console.log(options.get("mode"));
    });
});
