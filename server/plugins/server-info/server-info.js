var path = require("path");
var fs   = require("fs");
/**
 * @type {{plugin: Function, plugin:name: string, markup: string}}
 */
module.exports = {
    /**
     * @param cp
     * @param bs
     */
    "plugin": function (cp, bs) { /* noop */},

    /**
     * Hooks
     */
    "hooks": {
        "markup": "<server-info ng-if=\"options\" options=\"options\"></server-info>",
        "client:js": fs.readFileSync(__dirname + "/server-info.client.js"),
        "templates": {
            "templates/server-info.html":  fs.readFileSync(__dirname + "/server-info.html"),
            "templates/snippet-info.html": fs.readFileSync(__dirname + "/snippet-info.html"),
            "templates/url-info.html":     fs.readFileSync(__dirname + "/url-info.html")
        }
    },
    /**
     * Plugin name
     */
    "plugin:name": "Server Information"
};