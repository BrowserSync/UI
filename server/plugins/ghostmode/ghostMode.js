/**
 * @type {{plugin: Function, plugin:name: string, markup: string}}
 */
module.exports = {
    "plugin": function (cp, bs) {
        var sockets     = bs.io.sockets;
        sockets.on("connection", function (client) {
            client.on("urls:option:set", setOption.bind(null, bs));
        });
    },
    hooks: {
        "markup": "<h1>Ghostmode options</h1><option-list ng-if=\"options\" options=\"options\"></option-list>"
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
