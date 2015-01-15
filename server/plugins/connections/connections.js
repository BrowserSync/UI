var urls      = require("../../urls");
var url       = require("url");
var path      = require("path");
var fs        = require("fs");
var Immutable = require("immutable");
var UAParser  = require("ua-parser-js");
var uaParser  = new UAParser();

const PLUGIN_NAME = "Connections";

var connectedClients = Immutable.Map();

function decorateClients(connectedClients) {
    return connectedClients.map(function (client) {
        return client;
    });
}

/**
 * @param socket
 * @param connectedClients
 */
function sendUpdated(socket, connectedClients) {
    socket.emit("cp:connections:update", decorateClients(connectedClients));
}

/**
 * @param socketIoClients
 * @param connectedClients
 */
function cleanupConnections (connectedClients) {

}

/**
 * @type {{plugin: Function, plugin:name: string, markup: string}}
 */
module.exports = {
    /**
     * @param cp
     * @param bs
     */
    "plugin": function (cp, bs) {

        var registry = [];
        var socket   = bs.io.of(cp.config.getIn(["socket", "namespace"]));
        var clients  = bs.io.of(bs.options.getIn(["socket", "namespace"]));

        clients.on("connection", function (client) {

            client.on("client:heartbeat", function (data) {
                if (!registry.some(function (item) {
                    return item.id === client.id;
                })) {
                    registry.push({
                        id: client.id,
                        time: new Date().getTime(),
                        data: data
                    });
                } else {
                    registry = registry.map(function (item) {
                        if (item.id === client.id) {
                            item.time = new Date().getTime();
                        }
                        return item;
                    });
                }
            });
        });

        setInterval(function () {
            var current = new Date().getTime();
            registry = registry.filter(function (item) {
                return current - item.time < 1000;
            });
            sendUpdated(socket, registry);
        }, 1000);



        // Imitate a reaction to a heartbeat every 800ms - adding it to the registry
        //setInterval(function() {
        //    monitor.addItem({id: 123});
        //}, 800);

    },
    /**
     * Hooks
     */
    "hooks": {
        "markup": fs.readFileSync(path.join(__dirname, "connections.html")),
        "client:js": require("fs").readFileSync(__dirname + "/connections.client.js"),
        "templates": [
            path.join(__dirname, "/connections.directive.html")
        ],
        "page": {
            path: "/connections",
            title: PLUGIN_NAME,
            template: "connections.html",
            controller: PLUGIN_NAME + "Controller",
            order: 3,
            icon: "devices"
        }
    },
    /**
     * Plugin name
     */
    "plugin:name": PLUGIN_NAME
};

/**
 * @param immSet
 * @param client
 * @returns {*}
 */
function addClient (immSet, client) {
    return immSet.push({
        id: client.id,
        browser: uaParser.setUA(client.handshake.headers["user-agent"]).getBrowser()
    });
}