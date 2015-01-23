var urls      = require("../../urls");
var url       = require("url");
var path      = require("path");
var fs        = require("fs");
var Immutable = require("immutable");

const PLUGIN_NAME = "History";

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
                var temp = addPath(validUrls, url.parse(data.href), bs.options.get("mode"));
                sendUpdatedIfChanged(validUrls, temp, socket);
            });
        });

        socket.on("connection", function (cpClient) {

            sendUpdatedUrls(socket, validUrls);

            cpClient.on("urls:browser:url", sendToUrl.bind(null, cp, bs, clients));

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
            title: PLUGIN_NAME,
            template: "history.html",
            controller: PLUGIN_NAME + "Controller",
            order: 3,
            icon: "list2"
        },
        elements: [
            {
                type: "css",
                id: "__browser-sync-pesticidedepth__",
                active: false,
                file: __dirname + "/css/pesticide-depth.css",
                title: "CSS Depth outlining",
                served: false,
                name: "pesticide-depth2",
                src: "/browser-sync/pesticide-depth.css",
                tagline: "Add CSS box-shadows to all elements. (powered by <a href=\"http://pesticide.io\">Pesticide.io</a>)",
                hidden: ""
            }
        ]
    },
    /**
     * Plugin name
     */
    "plugin:name": PLUGIN_NAME
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
    }).toJS().reverse();
}

/**
 * Send all browsers to a URL
 */
function sendToUrl (cp, bs, clients, data) {

    var parsed = url.parse(data.path);

    data.override = true;
    data.path = parsed.path;
    data.url  = parsed.href;

    clients.emit("browser:location", data);
}

/**
 * Simple Browser reload
 */
function reloadAll(cp, bs, clients) {
    clients.emit("browser:reload");
}

/**
 * If snippet mode, add the full URL
 * if server/proxy, add JUST the path
 * @param immSet
 * @param urlObj
 * @param mode
 * @returns {Set}
 */
function addPath(immSet, urlObj, mode) {
    return immSet.add(
        mode === "snippet"
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
