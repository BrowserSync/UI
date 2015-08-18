var browserSync = require("/Users/shakyshane/sites/oss/browser-sync");
var ui          = require("../../index");
var assert      = require("chai").assert;
var path        = require("path");
var OPTPATH     = ['shakyshane', 'rewrite-rules', 'rules'];
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

describe("Adding rewrite rules", function() {

    it("initial state is running, but with no rules", function(done) {

        startWithRules(false, function (err, bs) {

            var rules   = bs.ui.options.getIn(OPTPATH).toJS();

            assert.equal(rules.length, 0);
            assert.equal(bs.rewriteRules.length, 1);
            assert.equal(bs.rewriteRules[0].id, "bs-snippet");

            bs.cleanup(done);
        });
    });
    it("can add a string replacement", function (done) {

        startWithRules(false, function (err, bs) {

            bs.ui.rewriteRules.addRule({
                match: {
                    type: "string",
                    value: "shane"
                },
                replace: {
                    type: "string",
                    value: "kittie"
                }
            });

            var rules = bs.ui.options.getIn(OPTPATH).toJS();
            assert.equal(rules.length, 1);

            var rule = rules[0];

            assert.equal(rule.match, "shane");
            assert.equal(rule.replace, "kittie");
            assert.equal(rule.matchInput, "shane");
            assert.equal(rule.matchType, "string");
            assert.equal(rule.replaceType, "string");
            assert.equal(rule.replaceInput, "kittie");
            assert.equal(typeof rule.id === "string", true);
            assert.equal(rule.active, true);
            assert.equal(rule.paths.length, 0);

            bs.cleanup(done);
        });
    });
    it("can add a string with empty replace", function (done) {

        startWithRules(false, function (err, bs) {

            bs.ui.rewriteRules.addRule({
                match: {
                    type: "string",
                    value: "shane"
                },
                replace: {
                    type: "string",
                    value: ""
                }
            });

            var rules = bs.ui.options.getIn(OPTPATH).toJS();
            assert.equal(rules.length, 1);

            var rule = rules[0];

            assert.equal(rule.match, "shane");
            assert.equal(rule.replace, "");
            assert.equal(rule.matchInput, "shane");
            assert.equal(rule.matchType, "string");
            assert.equal(rule.replaceType, "string");
            assert.equal(rule.replaceInput, "");
            assert.equal(typeof rule.id === "string", true);
            assert.equal(rule.active, true);
            assert.equal(rule.paths.length, 0);

            bs.cleanup(done);
        });
    })
});

