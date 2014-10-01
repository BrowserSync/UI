var urls        = require("../../urls");

var validUrls   = [{
    path: "/"
}];

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

            sendUpdatedUrls(sockets, validUrls);

            client.on("urls:browser:reload",   reloadAll.bind(bs));
            client.on("urls:browser:url",      sendToUrl.bind(bs, bs.getOption("urls.local")));
            client.on("urls:client:connected", function (data) {
                sendUpdatedUrls(sockets, urls.trackUrls(validUrls, data));
            });
        });
    },
    /**
     * Hooks
     */
    "hooks": {
        "markup": "<h1>Locations</h1><url-sync ng-if=\"options\" options=\"options\"></url-sync>",
        "client:js": require("fs").readFileSync(__dirname + "/urlsync.client.js", "utf-8")
    },
    /**
     * Plugin name
     */
    "plugin:name": "Locations"
};

/**
 *
 */
function sendUpdatedUrls (sockets, urls) {
    sockets.emit("cp:urls:update", urls);
}

/**
 * Send all browsers to a URL
 */
function sendToUrl (localUrl, data) {

    var bs = this;
    data.override = true;
    data.url = data.path;
    bs.io.sockets.emit("browser:location", data);
}

/**
 * Simple Browser reload
 */
function reloadAll() {
    this.io.sockets.emit("browser:reload");
}
