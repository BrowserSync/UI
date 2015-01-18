/**
 * Custom Notify module for Global notifications
 */
angular.module('bsHistory', ['Socket'])

    .service("History", ["$q", "$rootScope", "Socket", function ($q, $rootScope, Socket) {

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
            }
        };

        return api;
    }]);

