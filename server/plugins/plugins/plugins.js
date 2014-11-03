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
    "plugin": function (cp, bs) {

        var sockets = bs.io;

        sockets.on("connection", function (client) {
            client.on("plugins:configure", pluginConfigure.bind(null, bs));
        });
    },
    /**
     * Hooks
     */
    "hooks": {
        "markup": file("plugins.html"),
        "client:js": file("/plugins.client.js"),
        "templates": [
            getPath("plugins.directive.html")
        ],
        "page": {
            path: "/plugins",
            title: "Plugins",
            template: "plugins.html",
            controller: "PluginsController",
            order: 4,
            icon: "plug"
        }
    },
    /**
     * Plugin name
     */
    "plugin:name": "Plugins"
};

/**
 *
 */
function pluginConfigure (bs, data) {
    bs.events.emit("plugins:configure", data);
}

function getPath (filepath) {
    return path.join(__dirname, filepath);
}

function file (filepath) {
    return fs.readFileSync(getPath(filepath));
}