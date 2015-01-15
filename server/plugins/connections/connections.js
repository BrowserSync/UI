var urls      = require("../../urls");
var url       = require("url");
var path      = require("path");
var fs        = require("fs");
var Immutable = require("immutable");

const PLUGIN_NAME = "Connections";

/**
 * @type {{plugin: Function, plugin:name: string, markup: string}}
 */
module.exports = {
    /**
     * @param cp
     * @param bs
     */
    "plugin": function (cp, bs) {

        var socket  = bs.io.of(cp.config.getIn(["socket", "namespace"]));
        var clients = bs.io.of(bs.options.getIn(["socket", "namespace"]));

    },
    /**
     * Hooks
     */
    "hooks": {
        "markup": fs.readFileSync(path.join(__dirname, "connections.html")),
        "client:js": require("fs").readFileSync(__dirname + "/connections.client.js"),
        "templates": [
            path.join(__dirname, "/connections.directive.html")
        ],
        "page": {
            path: "/connections",
            title: PLUGIN_NAME,
            template: "connections.html",
            controller: PLUGIN_NAME + "Controller",
            order: 3,
            icon: "devices"
        }
    },
    /**
     * Plugin name
     */
    "plugin:name": PLUGIN_NAME
};