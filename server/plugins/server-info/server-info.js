var path = require("path");
var fs   = require("fs");

const PLUGIN_NAME = "Server Info";

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
        "markup": file("/server-info.html"),
        "client:js": file("/server-info.client.js"),
        "templates": [
            getPath("/snippet-info.html"),
            getPath("/url-info.html")
        ],
        "page": {
            path: "/",
            title: PLUGIN_NAME,
            template: "server-info.html",
            controller: PLUGIN_NAME.replace(" ", "") + "Controller",
            order: 1,
            icon: "cog"
        }
    },
    /**
     * Plugin name
     */
    "plugin:name": PLUGIN_NAME
};

function getPath (filepath) {
    return path.join(__dirname, filepath);
}

function file (filepath) {
    return fs.readFileSync(getPath(filepath));
}