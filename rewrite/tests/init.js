var browserSync = require("browser-sync");
var ui          = require("../../index");
var assert      = require("chai").assert;
var path        = require("path");
var OPTPATH     = ['shakyshane', 'rewrite-rules', 'opts', 'rules'];
var plugin      = path.resolve(__dirname, "../");

function startWithRules (rules, cb) {
    browserSync.reset();
    var bs = browserSync.create();

    bs.use(ui);

    bs.init({
        server: "test/fixtures",
        logLevel: "silent",
        rewriteRules: rules,
        open: false,
        plugins: [{module: plugin}]
    }, cb);
}

describe("Rules given in Browsersync configuration", function() {

    it("can work with simple string replacements", function(done) {

        startWithRules([
            {
                match: "shane",
                replace: "kittie"
            }
        ], function (err, bs) {

            var rules   = bs.ui.options.getIn(OPTPATH).toJS();
            var bsRules = bs.getOption('rewriteRules').toJS();

            assert.deepEqual(
                bsRules[0],
                {
                    match: "shane",
                    replace: "kittie"
                }
            );

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
            var bsRules = bs.getOption('rewriteRules').toJS();

            assert.equal(bsRules[0].match.source, 'shane');
            assert.equal(bsRules[0].match.global, true);
            assert.equal(bsRules[0].match.ignoreCase, false);
            assert.equal(bsRules[0].match.multiline, false);

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

        var fn = function () {
            return 'kittie';
        };

        startWithRules([
            {
                match: "shane",
                replace: fn
            }
        ], function (err, bs) {

            var rules = bs.ui.options.getIn(OPTPATH).toJS();
            var bsRules = bs.getOption('rewriteRules').toJS();

            assert.equal(bsRules[0].replace.toString(), fn.toString());
            assert.equal(rules.length, 1);

            assert.equal(rules[0].matchType,    "string");
            assert.equal(rules[0].matchInput,   "shane");

            assert.equal(rules[0].replaceType,  "function");
            assert.equal(rules[0].replaceInput, "return 'kittie';");

            bs.cleanup(done);
        });
    });
});

