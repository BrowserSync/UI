var path = require("path");
var fs   = require("fs");

/**
 * @type {{plugin: Function, plugin:name: string, markup: string}}
 */
module.exports = {
    "plugin": function (cp, bs) {
        var sockets = bs.io.sockets;
        sockets.on("connection", function (client) {
            client.on("cp:option:set", setOption.bind(null, bs));
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
 * @param bs
 * @param data
 */
function setOption(bs, data) {
    bs.setOption(data.key, data.value);
}


function getPath (filepath) {
    return path.join(__dirname, filepath);
}

function file (filepath) {
    return fs.readFileSync(getPath(filepath));
}
