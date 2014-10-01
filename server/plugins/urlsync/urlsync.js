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
        "markup": "<h1>Ghostmode options</h1><option-list ng-if=\"options\" options=\"options\"></option-list>",
        "client:js": require("fs").readFileSync(__dirname + "/ghostmode.client.js", "utf-8")
    },
    "plugin:name": "Ghostmode Options"
};

/**
 * @param bs
 * @param data
 */
function setOption(bs, data) {
    bs.setOption(data.key, data.value);
}
