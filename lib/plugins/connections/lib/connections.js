var Immutable = require("immutable");
var Rx = require('rx');
var fromEvent = Rx.Observable.fromEvent;

function getSocket (clients, sockets, id) {
    var match = clients.filter(x => x.get('id') === id).toList().get(0);
    if (match) {
        return sockets.filter(x => {
            return x.id === match.get('id');
        })[0];
    }
    return false;
}

/**
 * Track connected clients
 * @param {UI} ui
 * @param {BrowserSync} bs
 */
module.exports.init = function (ui, bs) {

    ui.listen('connections', {
        highlight: function (connection) {
            var match = getSocket(bs.clients$.getValue(), ui.clients.sockets, connection.id);
            if (match) {
                match.emit('highlight');
            }
        }
    });

    ui.clientList$ = new Rx.BehaviorSubject([]);

    ui.socket.on('connection', function (client) {

        bs.clients$
            .do(function (x) {
                client.emit('ui:connections:update', x.toList().toJS());
            })
            .subscribe(ui.clientList$);
    });
};


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
    socket.emit("ui:connections:update", connectedClients);
}