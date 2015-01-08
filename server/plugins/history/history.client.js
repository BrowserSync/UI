/**
 *
 */
(function (angular) {

    var SECTION_NAME = "history";

    angular.module("BrowserSync")

        .controller("HistoryController",
            ["$scope", "options", "$injector", "contentSections", historyController])

        .directive("historyList", function () {
            return {
                restrict: "E",
                scope: {
                    options: "=",
                    visited: "="
                },
                templateUrl: "history.directive.html",
                controller: ["$scope", "Location", historyDirective]
            }
        });

    /**
     * @param $scope
     * @param contentSections
     */
    function historyController($scope, options, $injector, contentSections) {

        $scope.options = options;
        $scope.section = contentSections[SECTION_NAME];
        $scope.ui = {
            visited: []
        };

        var Location = $injector.get("Location");
        var Socket   = $injector.get("Socket");

        $scope.updateVisited = function (data) {
            $scope.ui.visited = data;
            $scope.$digest();
        };

        Location.getHistory().then(function (items) {
            $scope.ui.visited = items;
        });

        $scope.clearVisited = function () {
            Location.clear();
            $scope.ui.visited = [];
        };

        Socket.on("cp:urls:update", $scope.updateVisited);

        $scope.$on('$destroy', function () {
            Socket.off("cp:urls:update", $scope.updateVisited);
        });
    }

    /**
     * Controller for the URL sync
     * @param $scope - directive scope
     * @param Location
     */
    function historyDirective($scope, Location) {

        $scope.removeVisited = function (data) {
            Location.remove(data);
        };

        /**
         * Emit the socket event
         */
        $scope.sendAllTo = function (path) {
            Location.sendAllTo(path);
        };
    }

})(angular);

