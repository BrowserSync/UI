/**
 *
 */
(function (angular) {

    var SECTION_NAME = "history";

    angular.module("BrowserSync")

        .controller("HistoryController",
            ["$scope", "$rootScope", "options", "$injector", "contentSections", historyController])

        .directive("historyList", function () {
            return {
                restrict: "E",
                scope: {
                    options: "="
                },
                templateUrl: "history.directive.html",
                controller: ["$scope", "$rootScope", "Location", "Socket", "contentSections", historyDirective]
            }
        });

    /**
     * @param $scope
     * @param $rootScope
     * @param Socket
     * @param contentSections
     */
    function historyController($scope, $rootScope, options, $injector, contentSections) {

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

        Socket.on("cp:urls:update", $scope.updateVisited);

        Location.getHistory().then(function (items) {
            $scope.ui.visited = items;
        });

        $scope.clearVisited = function () {
            Location.clear();
            $scope.ui.visited = [];
        };
    }

    /**
     * Controller for the URL sync
     * @param $scope
     * @param $rootScope
     * @param Location
     * @param Socket
     */
    function historyDirective($scope, $rootScope, Location, Socket) {

        /**
         * @type {{loading: boolean}}
         */
        $scope.ui = {
            loading: false,
            loaders: {
                "reloadAll": false,
                "sendAllTo": false,
                "newUrl": false
            }
        };

        /**
         * @type {{local: *, current: string}}
         */
        $scope.urls = {
            local: $scope.options.urls.local,
            current: "",
            visited: []
        };

        Location.getHistory().then(function (items) {
            $scope.urls.visited = items;
        });

        $scope.selectedUrl = null;

        /**
         *
         */
        $scope.updateVisited = function (data) {
            $scope.urls.visited = data;
            $scope.$digest();
        };

        $scope.removeVisited = function (data) {
            Location.remove(data);
        };

        /**
         * Emit the socket event
         */
        $scope.sendAllTo = function (path) {
            Location.sendAllTo(path);
        };

        Socket.on("cp:urls:update", $scope.updateVisited);

        $scope.$on('$destroy', function () {
            Socket.off("cp:urls:update", $scope.updateVisited);
        });
    }

})(angular);

