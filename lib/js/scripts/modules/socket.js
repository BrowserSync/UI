/**
 * @type {{emit: emit, on: on}}
 */
var socket = window.___browserSync___.socket || {

    emit: function () {},
    on: function () {},
    removeListener: function () {}
};

(function (angular) {

    /**
     * Custom Notify module for Global notifications
     */
    angular.module('Socket', [])

        .service("Socket", ["$q", "$rootScope", function ($q, $rootScope) {

            var deferred = $q.defer();

            socket.on("connection", function (out) {
                $rootScope.$emit("cp:connection", out);
                deferred.resolve(out, this);
            });

            socket.on("disconnect", function () {
                $rootScope.$emit("cp:disconnect");
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

})(angular);
