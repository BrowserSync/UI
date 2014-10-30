var urls = require("../../urls");
var path = require("path");
var fs   = require("fs");

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
        "markup": fs.readFileSync(path.join(__dirname, "history.html")),
        "client:js": require("fs").readFileSync(__dirname + "/history.client.js"),
        "templates": [
            path.join(__dirname, "/history.directive.html")
        ],
        "page": {
            path: "/history",
            title: "History",
            template: "history.html",
            controller: "HistoryController",
            order: 3
        }
    },
    /**
     * Plugin name
     */
    "plugin:name": "History"
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
