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
        "markup": fs.readFileSync(path.join(__dirname, "plugins.html")),
        "client:js": require("fs").readFileSync(__dirname + "/plugins.client.js"),
        "page": {
            path: "/plugins",
            template: "plugins.html",
            controller: "PluginsController"
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