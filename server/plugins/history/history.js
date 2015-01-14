var urls      = require("../../urls");
var url       = require("url");
var path      = require("path");
var fs        = require("fs");
var Immutable = require("immutable");

/**
 * @type {Immutable.Set}
 */
var timestamp;

/**
 * @type {{plugin: Function, plugin:name: string, markup: string}}
 */
module.exports = {
    /**
     * @param cp
     * @param bs
     */
    "plugin": function (cp, bs) {

        var validUrls = Immutable.OrderedSet();

        var socket  = bs.io.of(cp.config.getIn(["socket", "namespace"]));
        var clients = bs.io.of(bs.options.getIn(["socket", "namespace"]));

        function sendUpdatedIfChanged(current, temp, socket) {
            if (!Immutable.is(current, temp)) {
                validUrls = temp;
                sendUpdatedUrls(socket, validUrls);
            }
        }

        clients.on("connection", function (client) {
            client.on("urls:client:connected", function (data) {
                var temp = addPath(validUrls, url.parse(data.href), cp, bs);
                sendUpdatedIfChanged(validUrls, temp, socket);
            });
        });

        socket.on("connection", function (cpClient) {

            sendUpdatedUrls(socket, validUrls);

            cpClient.on("urls:browser:reload",   reloadAll.bind(null, cp, bs, clients));
            cpClient.on("urls:browser:url",      sendToUrl.bind(bs, bs.getOption("urls.local")));

            cpClient.on("cp:get:visited", function (req) {
                socket.emit("cp:receive:visited", decorateUrls(validUrls));
            });

            cpClient.on("cp:remove:visited", function (data) {
                var temp = removePath(validUrls, data.path);
                sendUpdatedIfChanged(validUrls, temp, socket);
            });
            cpClient.on("cp:clear:visited", function (data) {
                validUrls = Immutable.OrderedSet([]);
                sendUpdatedUrls(socket, validUrls);
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
    var count = 0;
    return urls.map(function (value, i) {
        count += 1;
        return {
            path: value,
            key: count
        };
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
function reloadAll(cp, bs, clients) {
    clients.emit("browser:reload");
}

/**
 * @param immSet
 * @param urlPath
 * @returns {*}
 */
function addPath(immSet, urlObj, cp, bs) {
    return immSet.add(
        bs.options.get("mode") === "snippet"
            ? urlObj.href
            : urlObj.path
    );
}

module.exports.addPath = addPath;

/**
 * @param immSet
 * @param urlPath
 * @returns {*}
 */
function removePath(immSet, urlPath) {
    return immSet.remove(url.parse(urlPath).path);
}

module.exports.removePath = removePath;
