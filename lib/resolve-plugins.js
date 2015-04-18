var fs          = require("fs");
var path        = require("path");

/**
 * Take BrowserSync plugins and determine if
 * any UI is provided by looking at data in the the
 * modules package.json file
 * @param plugins
 * @returns {*}
 */
module.exports = function (plugins) {
    return require("immutable")
        .fromJS(plugins)
        /**
         * Exclude the UI
         */
        .filter(function (plugin) {
            return plugin.get("name") !== "UI";
        })
        /**
         * Attempt to retrieve a plugins package.json file
         */
        .map(function (plugin) {

            var moduleName = plugin.getIn(["opts", "moduleName"]);
            var pkg = {};

            if (!moduleName) {
                return plugin;
            }

            try {
                pkg = require("immutable").fromJS(require(path.join(moduleName, "package.json")));
            } catch (e) {
                console.error(e);
                return plugin;
            }

            plugin = plugin.set("pkg", pkg);

            return plugin.set("relpath", path.dirname(require.resolve(moduleName)));
        })
        /**
         * Try to load markup for each plugin
         */
        .map(function (plugin) {

            if (!plugin.hasIn(["pkg", "browser-sync:ui"])) {
                return plugin;
            }
            var template = plugin.getIn(["pkg", "browser-sync:ui", "hooks", "templates"]);
            var markup   = plugin.getIn(["pkg", "browser-sync:ui", "hooks", "markup"]);
            var templatePath, markupPath;

            if (template.size) {

                templatePath = path.join(plugin.get("relpath"), template.get(0));
                markupPath   = path.join(plugin.get("relpath"), markup);

                if (fs.existsSync(templatePath)) {
                    plugin = plugin.set("templates", fs.readFileSync(templatePath, "utf-8"));
                    plugin = plugin.set("markup",    fs.readFileSync(markupPath, "utf-8"));
                }
            }

            return plugin;
        })
        /**
         * Try to load Client JS for each plugin
         */
        .map(function (plugin) {

            if (!plugin.hasIn(["pkg", "browser-sync:ui"])) {
                return plugin;
            }

            var clientJS = plugin.getIn(["pkg", "browser-sync:ui", "hooks", "client:js"]);
            var clientJSPath;

            if (clientJS.size) {

                clientJSPath = path.join(plugin.get("relpath"), clientJS.get(0));

                if (fs.existsSync(clientJSPath)) {
                    plugin = plugin.set("client:js", fs.readFileSync(clientJSPath, "utf-8"));
                }
            }

            return plugin;
        });
};