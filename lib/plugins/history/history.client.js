(function (angular) {

    const SECTION_NAME = "history";

    angular
        .module("BrowserSync")
        .controller("HistoryController", [
            "$scope",
            "options",
            "History",
            "Socket",
            "pagesConfig",
            historyController
        ]);

    /**
     * @param $scope
     * @param options
     * @param History
     * @param Socket
     * @param pagesConfig
     */
    function historyController($scope, options, History, Socket, pagesConfig) {

        var ctrl       = this;
        ctrl.options = options.bs;
        ctrl.section = pagesConfig[SECTION_NAME];
        ctrl.ui = {
            visited: []
        };

        History.getHistory().then(function (items) {
            ctrl.ui.visited = items;
        });

        ctrl.updateVisited = function (data) {
            ctrl.ui.visited = data;
            $scope.$digest();
        };

        ctrl.clearVisited = function () {
            History.clear();
            ctrl.ui.visited = [];
        };

        Socket.on("cp:urls:update", ctrl.updateVisited);

        $scope.$on("$destroy", function () {
            Socket.off("cp:urls:update", ctrl.updateVisited);
        });
    }

    angular
        .module("BrowserSync")
        .directive("historyList", function () {
            return {
                restrict: "E",
                scope: {
                    options: "=",
                    visited: "="
                },
                templateUrl: "history.directive.html",
                controller: ["$scope", "History", "Clients", historyDirective]
            };
        });

    /**
     * Controller for the URL sync
     * @param $scope - directive scope
     * @param History
     * @param Clients
     */
    function historyDirective($scope, History, Clients) {

        $scope.removeVisited = function (data) {
            History.remove(data);
        };

        $scope.sendAllTo = function (path) {
            Clients.sendAllTo(path);
        };
    }

})(angular);

