(function (angular) {

    angular
        .module("bsHistory", ["bsSocket"])
        .service("History", ["Socket", HistoryService]);

    function HistoryService (Socket) {

        var visited  = [];

        return {
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
    }

})(angular);

