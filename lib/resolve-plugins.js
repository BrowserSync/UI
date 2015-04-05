var fs          = require("fs");
var path        = require("path");
var pluginTmpl  = fs.readFileSync(path.resolve(__dirname, "../", "templates/plugin.item.tmpl"), "utf-8");
var pluginPage  = fs.readFileSync(path.resolve(__dirname, "plugins/plugins/plugins.html"), "utf-8");

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

            try {
                plugin = plugin.set("pkg", require("immutable").fromJS(require(path.join(moduleName, "package.json"))));
            } catch (e) {
                console.error(e);
                return plugin;
            }

            return plugin.set("relpath", path.dirname(require.resolve(moduleName)));
        })
        /**
         * Try to load markup for each plugin
         */
        .map(function (plugin) {

            var markup = plugin.getIn(["pkg", "browser-sync:ui", "hooks", "templates"]);
            var markupPath;

            if (markup.size) {

                markupPath = path.join(plugin.get("relpath"), markup.get(0));

                if (fs.existsSync(markupPath)) {
                    plugin = plugin.set("templates", fs.readFileSync(markupPath, "utf-8"));
                    plugin = plugin.set("markup", "<html-injector options='ctrl.options'></html-injector>")
                }
            }

            return plugin;
        })
        /**
         * Try to load Client JS for each plugin
         */
        .map(function (plugin) {

            var clientJS = plugin.getIn(["pkg", "browser-sync:ui", "hooks", "client:js"]);
            var clientJSPath;

            if (clientJS) {

                clientJSPath = path.join(plugin.get("relpath"), clientJS);

                if (fs.existsSync(clientJSPath)) {
                    plugin = plugin.set("client:js", fs.readFileSync(clientJSPath, "utf-8"));
                }
            }

            return plugin;
        });
};