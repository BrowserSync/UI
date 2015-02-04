var path      = require("path");
var Immutable = require("immutable");

const PLUGIN_NAME = "Connections";

/**
 * Use heart-beated data to decorate clients
 * @param clients
 * @param clientsInfo
 * @returns {*}
 */
function decorateClients(clients, clientsInfo) {
    return clients.map(function (item) {
        clientsInfo.forEach(function (client) {
            if (client.id === item.id) {
                item.data = client.data;
                return false;
            }
        });
        return item;
    });
}

/**
 * @param socket
 * @param connectedClients
 */
function sendUpdated(socket, connectedClients) {
    socket.emit("cp:connections:update", connectedClients);
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

        var uaParser = new bs.utils.UAParser();
        var currentConnections = [];

        cp.clients.on("connection", function (client) {
            client.on("client:heartbeat", function (data) {
                var match;
                if (currentConnections.some(function (item, index) {
                    if (item.id === client.id) {
                        match = index;
                        return true;
                    }
                        return false;
                })) {
                    if (typeof match === "number") {
                        currentConnections[match].timestamp = new Date().getTime();
                        currentConnections[match].data = data;
                    }
                } else {
                    currentConnections.push({
                        id: client.id,
                        timestamp: new Date().getTime(),
                        browser: uaParser.setUA(client.handshake.headers["user-agent"]).getBrowser(),
                        data: data
                    });
                }
            });
        });

        cp.socket.on("connection", function (client) {
            client.on("cp:highlight", highlightClient.bind(null, cp.clients));
            client.on("cp:get:clients", function () {
                client.emit("cp:receive:clients", registry || []);
            });
        });

        var registry;
        var temp;
        var initialSent;

        setInterval(function () {

            if (cp.clients.sockets.length) {
                temp = Immutable.List(cp.clients.sockets.map(function (client) {
                    return Immutable.fromJS({
                        id: client.id,
                        browser: uaParser.setUA(client.handshake.headers["user-agent"]).getBrowser()
                    });
                }));
                if (!registry) {
                    registry = temp;
                    sendUpdated(cp.socket, decorateClients(registry.toJS(), currentConnections));
                } else {
                    if (Immutable.is(registry, temp)) {
                        if (!initialSent) {
                            sendUpdated(cp.socket, decorateClients(registry.toJS(), currentConnections));
                            initialSent = true;
                        }
                    } else {
                        registry = temp;
                        sendUpdated(cp.socket, decorateClients(registry.toJS(), currentConnections));
                    }
                }
            } else {
                sendUpdated(cp.socket, []);
            }

        }, 1000);

    },
    /**
     * Hooks
     */
    "hooks": {
        //"markup": fs.readFileSync(path.join(__dirname, "connections.html")),
        "client:js": require("fs").readFileSync(__dirname + "/connections.client.js"),
        "templates": [
            path.join(__dirname, "/connections.directive.html")
        ]
        //"page": {
        //    path: "/connections",
        //    title: PLUGIN_NAME,
        //    template: "connections.html",
        //    controller: PLUGIN_NAME + "Controller",
        //    order: 3,
        //    icon: "devices"
        //}
    },
    /**
     * Plugin name
     */
    "plugin:name": PLUGIN_NAME
};

/**
 * @param clients
 * @param data
 */
function highlightClient (clients, data) {
    var socket = getClientById(clients, data.id);
    if (socket) {
        socket.emit("highlight");
    }
}

/**
 * @param clients
 * @param id
 */
function getClientById (clients, id) {
    var match;
    clients.sockets.some(function (item, i) {
        if (item.id === id) {
            match = clients.sockets[i];
            return true;
        }
    });
    return match;
}