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
        "markup": file("/server-info.html"),
        "client:js": file("/server-info.client.js"),
        "templates": [
            getPath("/snippet-info.html"),
            getPath("/url-info.html")
        ],
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

function getPath (filepath) {
    return path.join(__dirname, filepath);
}

function file (filepath) {
    return fs.readFileSync(getPath(filepath));
}