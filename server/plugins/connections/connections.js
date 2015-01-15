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
    return connectedClients;
    //return connectedClients.map(function (client) {
    //    return {
    //        browser: uaParser.setUA(client.handshake.headers["user-agent"]).getBrowser(),
    //        id: client.id
    //    }
    //});
}

/**
 * @param socket
 * @param connectedClients
 */
function sendUpdated(socket, connectedClients) {
    console.log(decorateClients(connectedClients));
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

        var socket   = bs.io.of(cp.config.getIn(["socket", "namespace"]));
        var clients  = bs.io.of(bs.options.getIn(["socket", "namespace"]));

        clients.on("connection", function (client) {
            client.on("client:heartbeat", function (data) {
                // todo add window size stuff
            });
        });

        socket.on("connection", function (client) {
            client.on("cp:highlight", function (data) {
                clients.sockets.some(function (item, i) {
                    if (item.id === data.id) {
                        clients.sockets[i].emit("highlight");
                        return true;
                    }
                });
            });
        });

        var registry;
        var temp;

        setInterval(function () {

            if (clients.sockets.length) {
                temp = Immutable.List(clients.sockets.map(function (client) {
                    return Immutable.fromJS({
                        id: client.id,
                        browser: uaParser.setUA(client.handshake.headers["user-agent"]).getBrowser()
                    });
                }));
                if (!registry) {
                    registry = temp;
                    sendUpdated(socket, registry.toJS());
                } else {
                    if (Immutable.is(registry, temp)) {
                        console.log("SAME, BRO, do nothing");
                    } else {
                        registry = temp;
                        console.log("Different, sending updates");
                        sendUpdated(socket, registry.toJS());
                    }
                }
            }

        }, 1000);
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