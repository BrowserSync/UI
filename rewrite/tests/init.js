/*jshint -W079 */
var browserSync = require("browser-sync");
var ui     = require("../../index");
var assert = require("chai").assert;
var path   = require("path");
var isMap  = require("immutable").Map.isMap;
var OPTPATH = ['shakyshane', 'rewrite-rules', 'opts', 'rules'];
function startWithRules (rules, cb) {
    browserSync.reset();
    var bs = browserSync.create();

    bs.use(ui);

    var plugin = {
        module: path.resolve(__dirname, "../")
    };
    bs.init({
        server: "test/fixtures",
        logLevel: "silent",
        rewriteRules: rules,
        open: false,
        plugins: [plugin]
    }, cb);
}

describe("Exising rules", function() {

    it("can work with simple string replacements", function(done) {

        startWithRules([
            {
                match: "shane",
                replace: "kittie"
            }
        ], function (err, bs) {

            var rules = bs.ui.options.getIn(OPTPATH).toJS();

            assert.equal(rules.length, 1);

            assert.equal(rules[0].matchType,    'string');
            assert.equal(rules[0].replaceType,  'string');
            assert.equal(rules[0].replaceInput, 'kittie');
            assert.equal(rules[0].matchInput,   'shane');

            bs.cleanup(done);
        });
    });
    it("can work with regex input", function(done) {

        startWithRules([
            {
                match: /shane/g,
                replace: "kittie"
            }
        ], function (err, bs) {

            var rules = bs.ui.options.getIn(OPTPATH).toJS();

            assert.equal(rules.length, 1);

            assert.equal(rules[0].matchType,    'regex');
            assert.equal(rules[0].matchInput,   'shane');
            assert.equal(rules[0].matchFlags,   'g');
            assert.equal(rules[0].replaceType,  'string');
            assert.equal(rules[0].replaceInput, 'kittie');

            bs.cleanup(done);
        });
    });
    it("can work with regex input with new", function(done) {

        startWithRules([
            {
                match: new RegExp("shane", "gi"),
                replace: "kittie"
            }
        ], function (err, bs) {

            var rules = bs.ui.options.getIn(OPTPATH).toJS();

            assert.equal(rules.length, 1);

            assert.equal(rules[0].matchType,    'regex');
            assert.equal(rules[0].matchInput,   'shane');
            assert.equal(rules[0].matchFlags,   'gi');
            assert.equal(rules[0].replaceType,  'string');
            assert.equal(rules[0].replaceInput, 'kittie');

            bs.cleanup(done);
        });
    });
    it("can work with function replace", function(done) {

        startWithRules([
            {
                match: "shane",
                replace: function () {
                    return 'kittie';
                }
            }
        ], function (err, bs) {

            var rules = bs.ui.options.getIn(OPTPATH).toJS();

            assert.equal(rules.length, 1);

            assert.equal(rules[0].matchType,    "string");
            assert.equal(rules[0].matchInput,   "shane");

            assert.equal(rules[0].replaceType,  "function");
            assert.equal(rules[0].replaceInput, "return 'kittie';");

            bs.cleanup(done);
        });
    });
});

