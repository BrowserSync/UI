var fs          = require("fs");
var path        = require("path");
var Immutable   = require("immutable");
var UI_PATH     = ["module", "browser-sync:ui"];
var UI_OPT_PATH = ["UI"];
/**
 * Take BrowserSync plugins and determine if
 * any UI is provided by looking at data in the the
 * modules package.json file
 * @param plugins
 * @returns {*}
 */
module.exports = function (plugins) {
    return plugins
        /**
         * Exclude the UI
         */
        .filter(function (plugin) {
            return plugin.get('name') !== "UI";
        })
        /**
         * Try to load markup for each plugin
         */
        .map(function (plugin) {

            if (!plugin.hasIn(UI_PATH)) {
                return plugin;
            }

            var markup    = plugin.getIn(UI_PATH.concat(['hooks', 'markup']));

            if (markup) {
                plugin = plugin.setIn(UI_OPT_PATH.concat(["markup"]), fs.readFileSync(path.resolve(plugin.get("dir"), markup), "utf8"));
            }

            return plugin;
        })
        /**
         * Load any template files for the plugin
         */
        .map(function (plugin) {

            if (!plugin.hasIn(UI_PATH)) {
                return plugin;
            }

            return resolveIfPluginHas(["module", "browser-sync:ui", "hooks", "templates"],
                ["UI", "templates"], plugin);
        })
        .map(function (plugin) {

            if (!plugin.hasIn(UI_PATH)) {
                return plugin;
            }

            return resolveIfPluginHas(["module", "browser-sync:ui", "hooks", "client:js"],
                ["UI", "client:js"], plugin);
        });
        /**
         * Try to load Client JS for each plugin
         */
        //.map(function (plugin) {
        //
        //    if (!plugin.hasIn(["module", "browser-sync:ui"])) {
        //        return plugin;
        //    }
        //
        //    return resolveIfPluginHas(["module", "browser-sync:ui", "hooks", "client:js"], "client:js", plugin);
        //});
};

/**
 * If a plugin contains this option path, resolve/read the files
 * @param {Array} optPath - How to access the collection
 * @param {Array} propName - Keys for property access
 * @param {Immutable.Map} plugin
 * @returns {*}
 */
function resolveIfPluginHas(optPath, propName, plugin) {
    var opt = plugin.getIn(optPath);
    if (opt && opt.size) {
        return plugin.setIn(
            propName,
            resolvePluginFiles(opt, plugin.get("dir"))
        );
    }
    return plugin;
}

/**
 * Read & store a file from a plugin
 * @param {Array|Immutable.List} collection
 * @param {String} relPath
 * @returns {any}
 */
function resolvePluginFiles (collection, relPath) {
    return Immutable.fromJS(collection.reduce(function (all, item) {
        var full = path.join(relPath, item);
        if (fs.existsSync(full)) {
            all[full] = fs.readFileSync(full, "utf8");
        }
        return all;
    }, {}));
}