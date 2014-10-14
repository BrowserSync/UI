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
        "markup": "<plugins ng-if=\"options\" options=\"options\"></plugins>",
        "templates": {
            "templates/plugins.html": fs.readFileSync(path.join(__dirname, "plugins.html"))
        },
        "client:js": require("fs").readFileSync(__dirname + "/plugins.client.js")
    },
    /**
     * Plugin name
     */
    "plugin:name": "Plugins"
};

/**
 * Emit an event back to BrowserSync re: plugins
 */
function pluginConfigure (bs, data) {
    bs.events.emit("plugins:configure", data);
}