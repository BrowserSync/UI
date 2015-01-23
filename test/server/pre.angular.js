/*jshint -W079 */
var assert  = require("chai").assert;
var directive = require("../../lib/hooks");

describe("Stripping simple Angular templating/directives where binding not needed", function(){

    it("should swap section headers for actual text", function() {
        var input = "<article>{{ctrl.section.title}}</article>";
        assert.deepEqual(
            directive.bindOnce(input, {title: "Connections"}),
            "<article>Connections</article>"
        );
    });
});
