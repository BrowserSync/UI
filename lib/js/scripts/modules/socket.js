/**
 * @type {{emit: emit, on: on}}
 */
var socket = window.___socket___ || {
    emit: function(){},
    on: function(){},
    removeListener: function(){}
};

/**
 *
 * Custom Notify module for Global notifications
 *
 */
angular.module('Socket', [])

    .service("Socket", function () {

        return {
            addEvent: function (name, callback) {
                socket.on(name, callback);
            },
            removeEvent: function (name, callback) {
                socket.removeListener(name, callback);
            },
            emit: function (name, data) {
                socket.emit(name, data || {});
            }
        };
    });