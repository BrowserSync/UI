/**
 * @type {{emit: emit, on: on}}
 */
var socket = window.___browserSync___.socket || {

    emit: function () {},
    on: function () {},
    removeListener: function () {}
};

/**
 * Custom Notify module for Global notifications
 */
angular.module('Socket', [])

    .service("Socket", ["$q", function ($q) {

        var deferred = $q.defer();

        socket.on("connection", function (out) {
            deferred.resolve(out, this);
        });

        return {
            on: function (name, callback) {
                socket.on(name, callback);
            },
            removeEvent: function (name, callback) {
                socket.removeListener(name, callback);
            },
            emit: function (name, data) {
                socket.emit(name, data || {});
            },
            options: function () {
                return deferred.promise;
            }
        };
    }]);