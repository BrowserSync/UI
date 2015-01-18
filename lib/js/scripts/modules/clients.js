/**
 * Custom Notify module for Global notifications
 */
angular.module('bsClients', ['Socket'])

    .service("Clients", ["$q", "$rootScope", "Socket", function ($q, $rootScope, Socket) {

        var api = {
            reloadAll: function () {
                Socket.clientEvent("browser:reload");
            },
            sendAllTo: function (path) {
                Socket.emit("urls:browser:url", {
                    path: path
                });
            },
            scrollAllTo: function () {
                Socket.clientEvent("scroll", {
                    position: {
                        raw: 0,
                        proportional: 0
                    },
                    override: true
                });
            },
            highlight: function (connection) {
                Socket.emit("cp:highlight", connection);
            }
        };

        return api;
    }]);

