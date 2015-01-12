var path = require("path");
var fs   = require("fs");

/**
 * @type {{plugin: Function, plugin:name: string, markup: string}}
 */
module.exports = {
    "plugin": function (cp, bs) {
        var socket  = bs.io.of(cp.config.getIn(["socket", "namespace"]));
        socket.on("connection", function (client) {
            client.on("cp:option:set", setOption.bind(null, cp, bs));
            client.on("cp:option:setMany", setOptions.bind(null, cp, bs));
        });
    },
    "hooks": {
        "markup": file("sync-options.html"),
        "client:js": file("sync-options.client.js"),
        "templates": [
            getPath("/sync-options-list.html"),
        ],
        "page": {
            path: "/sync-options",
            title: "Sync Options",
            template: "sync-options.html",
            controller: "SyncOptionsController",
            order: 2,
            icon: "repeat_2"
        }
    },
    "plugin:name": "Sync Options"
};

/**
 * @param cp
 * @param bs
 * @param value
 */
function setOptions (cp, bs, value) {

    cp.logger.info("Setting Many options...");

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
 * @param bs
 * @param data
 */
function setOption (cp, bs, data) {
    cp.logger.debug("Setting option: {magenta:%s}:{cyan:%s}", data.path.join("."), data.value);
    bs.setOptionIn(data.path, data.value);
}

function getPath (filepath) {
    return path.join(__dirname, filepath);
}

function file (filepath) {
    return fs.readFileSync(getPath(filepath));
}
