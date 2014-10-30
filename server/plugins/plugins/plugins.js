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
        "templates": {
            "templates/plugins.directive.html": fs.readFileSync(path.join(__dirname, "plugins.directive.html"))
        },
        "page": {
            path: "/plugins",
            title: "Plugins",
            template: "plugins.html",
            controller: "PluginsController",
            order: 4
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