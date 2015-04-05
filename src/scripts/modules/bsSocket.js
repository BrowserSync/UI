(function (angular, browserSyncSocket) {

    /**
     * @type {{emit: emit, on: on}}
     */
    var socket = browserSyncSocket || {

        emit: function () {},
        on: function () {},
        removeListener: function () {}
    };

    angular
        .module("bsSocket", [])
        .service("Socket", ["$q", "$rootScope", SocketService]);

    function SocketService ($q, $rootScope) {

        var deferred = $q.defer();

        socket.on("connection", function (out) {
            $rootScope.$emit("ui:connection", out);
            deferred.resolve(out, this);
        });

        socket.on("disconnect", function () {
            $rootScope.$emit("ui:disconnect");
        });

        return {
            on: function (name, callback) {
                socket.on(name, callback);
            },
            off: function (name, callback) {
                socket.off(name, callback);
            },
            removeEvent: function (name, callback) {
                socket.removeListener(name, callback);
            },
            emit: function (name, data) {
                socket.emit(name, data || {});
            },
            /**
             * Proxy client events
             * @param name
             * @param data
             */
            clientEvent: function (name, data) {
                socket.emit("ui:client:proxy", {
                    event: name,
                    data: data
                });
            },
            options: function () {
                return deferred.promise;
            },
            getData: function (name) {
                var deferred = $q.defer();
                socket.on("ui:receive:" + name, function (data) {
                    deferred.resolve(data);
                });
                socket.emit("ui:get:" + name);
                return deferred.promise;
            },
            uiEvent: function (evt) {
                socket.emit("ui", evt);
            }
        };
    }

})(angular, window.___browserSync___.socket);
