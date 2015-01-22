(function (angular) {

    const SECTION_NAME = "history";
    var module         = angular.module("BrowserSync");

    module.controller("HistoryController", [
        "$scope",
        "options",
        "History",
        "Socket",
        "pagesConfig",
        function historyController($scope, options, History, Socket, pagesConfig) {

            $scope.options = options;
            $scope.section = pagesConfig[SECTION_NAME];
            $scope.ui = {
                visited: []
            };

            History.getHistory().then(function (items) {
                $scope.ui.visited = items;
            });

            $scope.updateVisited = function (data) {
                $scope.ui.visited = data;
                $scope.$digest();
            };

            $scope.clearVisited = function () {
                History.clear();
                $scope.ui.visited = [];
            };

            Socket.on("cp:urls:update", $scope.updateVisited);

            $scope.$on('$destroy', function () {
                Socket.off("cp:urls:update", $scope.updateVisited);
            });
        }
    ]);

    module.directive("historyList", function () {
        return {
            restrict: "E",
            scope: {
                options: "=",
                visited: "="
            },
            templateUrl: "history.directive.html",
            controller: ["$scope", "History", "Clients", historyDirective]
        }
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

