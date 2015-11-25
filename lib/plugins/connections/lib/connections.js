var Immutable = require("immutable");
var Rx = require('rx');
var fs = require('fs');
var path = require('path');
var fromEvent = Rx.Observable.fromEvent;

/**
 * Track connected clients
 * @param {UI} ui
 * @param {BrowserSync} bs
 */
module.exports.init = function (ui, bs) {

    bs.setOption('clientJs', function (js) {
        return js.concat({
            via: 'UI Connections plugin - highlight',
            content: fs.readFileSync(path.join(__dirname, '../', 'client.highlight.js'))
        });
    }).subscribe();

    ui.listen('connections', {
        highlight: function (connection) {
            var match = bs.getSocket(connection.id);
            if (match) {
                match.emit('ui:highlight');
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