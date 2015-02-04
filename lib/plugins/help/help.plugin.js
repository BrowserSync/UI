var path      = require("path");
var fs        = require("fs");

const PLUGIN_NAME = "Help / About";

/**
 * @type {{plugin: Function, plugin:name: string, markup: string}}
 */
module.exports = {
    /**
     * Plugin init
     */
    "plugin": function () {},
    /**
     * Hooks
     */
    "hooks": {
        "markup": fs.readFileSync(path.join(__dirname, "/../../../static/content/help.content.html")),
        "client:js": require("fs").readFileSync(__dirname + "/help.client.js"),
        "templates": [
            path.join(__dirname, "/help.directive.html")
        ],
        "page": {
            path: "/help",
            title: PLUGIN_NAME,
            template: "help.html",
            controller: "HelpAboutController",
            order: 5,
            icon: "help"
        }
    },
    /**
     * Plugin name
     */
    "plugin:name": PLUGIN_NAME
};