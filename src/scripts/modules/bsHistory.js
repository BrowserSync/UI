(function (angular) {

    angular
        .module("bsHistory", ["bsSocket"])
        .service("History", ["Socket", HistoryService]);

    function HistoryService (Socket) {

        var visited     = [];
        var updateStack = [];

        /**
         * Add a single socket event and call all callbacks listening to it.
         */
        Socket.on("ui:history:update", function (items) {
            updateStack.forEach(function (fn) {
                fn(items);
            });
        });

        return {
            visited: visited,
            updateHistory: function (urls) {
                visited = urls;
            },
            get: function () {
                return Socket.getData("visited");
            },
            remove: function (data) {
                Socket.emit("ui:history:remove", data);
            },
            clear: function () {
                Socket.emit("ui:history:clear");
            },
            on: function (event, fn) {
                updateStack.push(fn);
            },
            off: function (fn) {
                var index = updateStack.indexOf(fn);
                if (index > -1) {
                    updateStack = updateStack.splice(index, 1);
                }
            }
        };
    }

})(angular);

