const PLUGIN_NAME = "Plugins";

/**
 * @type {{plugin: Function, plugin:name: string, markup: string}}
 */
module.exports = {
    /**
     * @param ui
     * @param bs
     */
    "plugin": function (ui, bs) {
        ui.socket.on("connection", function (client) {
            client.on("ui:plugins:set",     pluginConfigure.bind(null, ui, bs));
            client.on("ui:plugins:setMany", pluginConfigureMany.bind(null, ui, bs));
        });
    },
    /**
     * Hooks
     */
    "hooks": {
        "markup": fileContent("plugins.html"),
        "client:js": fileContent("/plugins.client.js"),
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
 * @param {UI} ui
 * @param {BrowserSync} bs
 * @param {Object} data
 */
function pluginConfigure (ui, bs, data) {
    bs.events.emit("plugins:configure", data);
}

/**
 * Configure many plugins
 */
function pluginConfigureMany (ui, bs, value) {

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
/**
 * @param filepath
 * @returns {*}
 */
function getPath (filepath) {
    return require("path").join(__dirname, filepath);
}

/**
 * @param filepath
 * @returns {*}
 */
function fileContent (filepath) {
    return require("fs").readFileSync(getPath(filepath));
}