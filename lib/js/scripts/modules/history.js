/**
 * Custom Notify module for Global notifications
 */
angular.module('History', ['Socket'])

    .service("Location", ["$q", "$rootScope", "Socket", function ($q, $rootScope, Socket) {

        var deferred = $q.defer();
        
        //console.log(Socket);

        //socket.on("connection", function (out) {
        //    $rootScope.$emit("cp:connection", out);
        //    deferred.resolve(out, this);
        //});
        //
        //socket.on("disconnect", function () {
        //    $rootScope.$emit("cp:disconnect");
        //});

        return {
            refreshAll: function () {
                Socket.emit("urls:browser:reload");
            },
            sendAllTo: function (path) {

                Socket.emit("urls:browser:url", {
                    path: path
                });
            }
        };
    }]);

