var path = require("path");
var fs   = require("fs");

const PLUGIN_NAME = "Overview";

/**
 * @type {{plugin: Function, plugin:name: string, markup: string}}
 */
module.exports = {
    /**
     * Plugin init
     */
    "plugin": function () { /* noop */ },

    /**
     * Hooks
     */
    "hooks": {
        "markup": file("/overview.html"),
        "client:js": file("/overview.client.js"),
        "templates": [
            getPath("/snippet-info.html"),
            getPath("/url-info.html")
        ],
        "page": {
            path: "/",
            title: PLUGIN_NAME,
            template: "overview.html",
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