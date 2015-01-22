/*jshint -W079 */
var assert  = require("chai").assert;
var directive = require("../../lib/directive-stripper");

describe("Stripping simple Angular templating/directives where binding not needed", function(){

    it("should swap section headers for actual text", function() {
        var input = "<article>{{section.title}}</article>";
        assert.deepEqual(
            directive.bindOnce(input, {title: "Connections"}),
            "<article>Connections</article>"
        );
    });

    it("should swap section headers + Icon directive for actual values", function(done) {
        var input = "<h1 bs-heading><icon icon=\"{{section.icon}}\"></icon> {{section.title}}</h1>";
        var binded = directive.bindOnce(input, {title: "Connections"});
        directive.directiveStripper({icon: "shane"}, "icon", binded, function (err, out) {
            assert.deepEqual(
                "<h1 bs-heading><svg bs-svg-icon><use xlink:href=\"#svg-shane\"></use></svg> Connections</h1>",
                out
            );
            done();
        });
    });
});
