var path   = require("path");
var fs     = require("fs");

const PLUGIN_NAME = "Plugins";

/**
 * @type {{plugin: Function, plugin:name: string, markup: string}}
 */
module.exports = {
    /**
     * @param cp
     * @param bs
     */
    "plugin": function (cp, bs) {

        cp.socket.on("connection", function (client) {
            client.on("cp:plugins:set",     pluginConfigure.bind(null, cp, bs));
            client.on("cp:plugins:setMany", pluginConfigureMany.bind(null, cp, bs));
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
            title: PLUGIN_NAME,
            template: "plugins.html",
            controller: PLUGIN_NAME + "Controller",
            order: 4,
            icon: "plug"
        }
    },
    /**
     * Plugin name
     */
    "plugin:name": PLUGIN_NAME
};

/**
 * Configure 1 plugin
 * @param {UI} cp
 * @param {BrowserSync} bs
 * @param {Object} data
 */
function pluginConfigure (cp, bs, data) {
    bs.events.emit("plugins:configure", data);
}

/**
 * Configure many plugins
 */
function pluginConfigureMany (cp, bs, value) {

    if (value !== true) {
        value = false;
    }

    bs.getUserPlugins()
        .filter(function (item) {
            return item.name !== "UI    "; // todo dupe code server/client
        })
        .forEach(function (item) {
            item.active = value;
            bs.events.emit("plugins:configure", item);
        });
}

function getPath (filepath) {
    return path.join(__dirname, filepath);
}

function file (filepath) {
    return fs.readFileSync(getPath(filepath));
}