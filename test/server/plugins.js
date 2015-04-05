/*jshint -W079 */
var browserSync = require("browser-sync");
var ui          = require("../../index");
var assert      = require("chai").assert;
var path        = require("path");

describe("Can resolve pluings", function() {

    it("can return plugins with added meta data", function(done) {

        browserSync.reset();
        browserSync.use(ui);
        var plugin = {};
        var pluginPath = path.resolve(__dirname, "../", "fixtures/plugin");
        plugin[pluginPath] = {};
        browserSync({
            server: "test/fixtures",
            logLevel: "silent",
            open: false,
            plugins: [plugin]
        }, function (err, bs) {

            assert.equal(bs.ui.bsPlugins.size, 1);
            assert.isTrue(require("immutable").Map.isMap(bs.ui.bsPlugins.get(0).get("pkg")));
            assert.isString(bs.ui.bsPlugins.get(0).get("client:js"));

            assert.include(bs.ui.templates, "id=\"test.directive.html");
            assert.include(bs.ui.templates, "<h1>Test markup from Test Directive</h1>");
            assert.include(bs.ui.clientJs, "const PLUGIN_NAME = \"Test Plugin\";");

            bs.cleanup();
            done();
        });
    });
    it("Does not blow up when Plugin does not contain any UI", function(done) {

        browserSync.reset();
        browserSync.use(ui);
        var plugin = {};
        var pluginPath = path.resolve(__dirname, "../", "fixtures/plugin-noui");
        plugin[pluginPath] = {};
        browserSync({
            server: "test/fixtures",
            logLevel: "silent",
            open: false,
            plugins: [plugin]
        }, function (err, bs) {
            assert.equal(bs.ui.bsPlugins.size, 1);
            assert.isTrue(require("immutable").Map.isMap(bs.ui.bsPlugins.get(0).get("pkg")));
            bs.cleanup();
            done();
        });
    });

    it("Does not blow up when mixed plugins used together", function(done) {

        browserSync.reset();
        browserSync.use(ui);
        var plugin1 = {};
        var pluginPath = path.resolve(__dirname, "../", "fixtures/plugin");
        plugin1[pluginPath] = {};
        var plugin2 = {};
        var pluginPath = path.resolve(__dirname, "../", "fixtures/plugin-noui");
        plugin2[pluginPath] = {};
        browserSync({
            server: "test/fixtures",
            logLevel: "silent",
            open: false,
            plugins: [plugin1, plugin2]
        }, function (err, bs) {
            assert.equal(bs.ui.bsPlugins.size, 2);
            assert.isTrue(require("immutable").Map.isMap(bs.ui.bsPlugins.get(0).get("pkg")));
            assert.isString(bs.ui.bsPlugins.get(0).get("client:js"));

            assert.include(bs.ui.templates, "id=\"test.directive.html");
            assert.include(bs.ui.templates, "<h1>Test markup from Test Directive</h1>");
            assert.include(bs.ui.clientJs, "const PLUGIN_NAME = \"Test Plugin\";");
            bs.cleanup();
            done();
        });
    });
});

