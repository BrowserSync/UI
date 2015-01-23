var urls      = require("../../urls");
var url       = require("url");
var path      = require("path");
var fs        = require("fs");
var Immutable = require("immutable");

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
    //console.log(decorateClients(connectedClients));
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

        var uaParser = new bs.utils.UAParser();

        cp.clients.on("connection", function (client) {
            client.on("client:heartbeat", function (data) {
                // console.log(data, client.id);
                // todo add window size stuff
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
        var count = 0;
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
                    sendUpdated(cp.socket, registry.toJS());
                } else {
                    if (Immutable.is(registry, temp)) {
                        if (!initialSent) {
                            sendUpdated(cp.socket, registry.toJS());
                            initialSent = true;
                        }
                    } else {
                        registry = temp;
                        sendUpdated(cp.socket, registry.toJS());
                    }
                }
            }
            count += 1;
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
    var socket;
    if (socket = getClientById(clients, data.id)) {
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