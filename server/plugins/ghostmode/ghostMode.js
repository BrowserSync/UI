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
        "markup": fs.readFileSync(path.join(__dirname, "ghostmode.html")),
        "client:js": fs.readFileSync(path.join(__dirname, "ghostmode.client.js"))
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
