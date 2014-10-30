var path = require("path");
var fs   = require("fs");

var NAME = "Server Info";

/**
 * @type {{plugin: Function, plugin:name: string, markup: string}}
 */
module.exports = {
    /**
     * @param cp
     * @param bs
     */
    "plugin": function (cp, bs) { /* noop */ },

    /**
     * Hooks
     */
    "hooks": {
        "markup": fs.readFileSync(__dirname + "/server-info.html"),
        "client:js": fs.readFileSync(__dirname + "/server-info.client.js"),
        "templates": {
            "templates/snippet-info.html": fs.readFileSync(__dirname + "/snippet-info.html"),
            "templates/url-info.html":     fs.readFileSync(__dirname + "/url-info.html")
        },
        "page": {
            path: "/",
            title: "Server Info",
            template: "server-info.html",
            controller: "ServerController",
            order: 1
        }
    },
    /**
     * Plugin name
     */
    "plugin:name": "Server Information"
};