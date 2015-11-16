var Immutable = require("immutable");
var Rx = require('rx');
var fromEvent = Rx.Observable.fromEvent;

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

    ui.clientList$ = new Rx.BehaviorSubject(bs.clients$.getValue());

    /**
     * Combine any UI connection events with
     * updated Browsersync client updates
     * and emit them back to the UI
     */
    Rx.Observable
        .fromEvent(ui.socket, 'connection')
            .combineLatest(bs.clients$, (socket, clients) => ({socket, clients}))
        .do(x => sendClients(x.socket, x.clients))
        .pluck('clients')
        .subscribe(ui.clientList$);
};

/**
 * @param {OrderedMap} clients - Browsersync connected clients
 * @param {Array} sockets - Socket.io connected clients
 * @param {string} id - Browsersync client ID (Note: this is different from the socket.io id)
 * @returns {Socket|Boolean}
 */
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
 * @param {Socket} socket - UI socket connection
 * @param {OrderedMap} clients - Connected Browsersync Clients
 */
function sendClients (socket, clients) {
    socket.emit('ui:connections:update', clients.toList())
}

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