/**
 * Custom Notify module for Global notifications
 */
angular.module('History', ['Socket'])

    .service("Location", ["$q", "$rootScope", "Socket", function ($q, $rootScope, Socket) {

        var visited  = [];

        var api = {
            visited: visited,
            updateHistory: function (urls) {
                visited = urls;
            },
            getHistory: function () {
                return Socket.getData("visited");
            },
            remove: function (data) {
                Socket.emit("cp:remove:visited", data);
            },
            clear: function () {
                Socket.emit("cp:clear:visited");
            },
            refreshAll: function () {
                Socket.emit("urls:browser:reload");
            },
            sendAllTo: function (path) {
                Socket.emit("urls:browser:url", {
                    path: path
                });
            }
        };

        //Socket.on("cp:urls:update", api.updateHistory);

        //console.log(Socket);

        //socket.on("connection", function (out) {
        //    $rootScope.$emit("cp:connection", out);
        //    deferred.resolve(out, this);
        //});

        return api;
    }]);

