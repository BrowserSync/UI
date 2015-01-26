var urls      = require("../../urls");
var url       = require("url");
var path      = require("path");
var fs        = require("fs");
var Immutable = require("immutable");

const PLUGIN_NAME = "Help / About";

/**
 * @type {{plugin: Function, plugin:name: string, markup: string}}
 */
module.exports = {
    /**
     * @param cp
     * @param bs
     */
    "plugin": function (cp, bs) {
        /* noop */
    },
    /**
     * Hooks
     */
    "hooks": {
        "markup": fs.readFileSync(path.join(__dirname, "/../../../static/_components/help-content.html")),
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