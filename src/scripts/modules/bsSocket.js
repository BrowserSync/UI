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

            if (window.name === '') {
                window.name = JSON.stringify({id: socket.id});
            } else {
                var prev = JSON.parse(window.name);
                console.log(prev, socket);
                if (prev.id !== socket.id) {
                    console.log('new session');
                } else {
                    console.log('page reload');
                }
                //console.log(JSON.parse(window.name));
            }
        });

        socket.on("disconnect", function () {
            $rootScope.$emit("ui:disconnect");
        });

        return {
            id: function () {
                return socket.id;
            },
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
            },
            newSession: function () {

            }
        };
    }

})(angular, window.___browserSync___.socket);
