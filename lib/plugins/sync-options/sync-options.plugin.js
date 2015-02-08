const PLUGIN_NAME = "Sync Options";

/**
 * @type {{plugin: Function, plugin:name: string, hooks: object}}
 */
module.exports = {
    "plugin": function (ui, bs) {
        ui.socket.on("connection", function (client) {
            client.on("ui:option:set", setOption.bind(null, ui, bs));
            client.on("ui:option:setMany", setOptions.bind(null, ui, bs));
        });
    },
    "hooks": {
        "markup": fileContent("sync-options.html"),
        "client:js": fileContent("sync-options.client.js"),
        "templates": [
            getPath("/sync-options-list.html")
        ],
        "page": {
            path: "/sync-options",
            title: PLUGIN_NAME,
            template: "sync-options.html",
            controller: PLUGIN_NAME.replace(" ", "") + "Controller",
            order: 2,
            icon: "sync"
        }
    },
    "plugin:name": PLUGIN_NAME
};

/**
 * @param ui
 * @param bs
 * @param value
 */
function setOptions (ui, bs, value) {

    ui.logger.debug("Setting Many options...");

    if (value !== true) {
        value = false;
    }

    bs.setMany(function (item) {
        [
            ["codeSync"],
            ["ghostMode", "clicks"],
            ["ghostMode", "scroll"],
            ["ghostMode", "forms", "inputs"],
            ["ghostMode", "forms", "toggles"],
            ["ghostMode", "forms", "submit"]
        ].forEach(function (option) {
            item.setIn(option, value);
        });
    });

    return bs;
}

/**
 * @param ui
 * @param bs
 * @param data
 */
function setOption (ui, bs, data) {
    ui.logger.debug("Setting option: {magenta:%s}:{cyan:%s}", data.path.join("."), data.value);
    bs.setOptionIn(data.path, data.value);
}

function getPath (filepath) {
    return require("path").join(__dirname, filepath);
}

function fileContent (filepath) {
    return require("fs").readFileSync(getPath(filepath));
}
