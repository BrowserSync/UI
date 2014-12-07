var urls = require("../../urls");
var url  = require("url");
var path = require("path");
var fs   = require("fs");
var Immutable   = require("immutable");

/**
 * @type {Immutable.Set}
 */
var validUrls   = Immutable.OrderedSet('/');

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
                validUrls = validUrls.add(url.parse(data.path).path);
                sendUpdatedUrls(sockets, validUrls);
            });
            client.on("cp:get:visited", function (req) {
                sockets.emit("cp:receive:visited", decorateUrls(validUrls));
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
            order: 3,
            icon: "book_2"
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
    sockets.emit("cp:urls:update", decorateUrls(urls));
}

/**
 * @param {Immutable.Set} urls
 * @returns {Array}
 */
function decorateUrls (urls) {
    return urls.map(function (value) {
        return {
            path: value
        }
    }).toJS();
}

/**
 * Send all browsers to a URL
 */
function sendToUrl (localUrl, data) {

    var parsed = url.parse(data.path);
    var bs = this;
    data.path = parsed.path;
    data.override = true;
    data.url = parsed.href;
    bs.io.sockets.emit("browser:location", data);
}

/**
 * Simple Browser reload
 */
function reloadAll() {
    this.io.sockets.emit("browser:reload");
}
