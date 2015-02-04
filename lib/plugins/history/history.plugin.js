var path          = require("path");
var fs            = require("fs");
var historyPlugin = require("./history");

const PLUGIN_NAME = "History";

/**
 * @type {{plugin: Function, plugin:name: string, markup: string}}
 */
module.exports = {
    /**
     * @param ui
     * @param bs
     */
    "plugin": function (ui, bs) {
        ui.history = historyPlugin.init(ui, bs);
    },
    /**
     * Hooks
     */
    "hooks": {
        "markup": fs.readFileSync(path.join(__dirname, "history.html")),
        "client:js": require("fs").readFileSync(__dirname + "/history.client.js"),
        "templates": [
            path.join(__dirname, "/history.directive.html")
        ],
        "page": {
            path: "/history",
            title: PLUGIN_NAME,
            template: "history.html",
            controller: PLUGIN_NAME + "Controller",
            order: 3,
            icon: "list2"
        }
    },
    /**
     * Plugin name
     */
    "plugin:name": PLUGIN_NAME
};
