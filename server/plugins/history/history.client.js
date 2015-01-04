/**
 *
 */
(function (angular) {

    var SECTION_NAME = "history";

    angular.module("BrowserSync")

        .controller("HistoryController",
            ["$scope", "$rootScope", "options", "Socket", "contentSections", historyController])

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
    function historyController($scope, $rootScope, options, Socket, contentSections) {
        $scope.options = options;
        $scope.section = contentSections[SECTION_NAME];
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

        /**
         * Emit the socket event
         */
        $scope.sendAllTo = function (path) {
            //$scope.urls.current = $scope.options.urls.local + "/";
            console.log(path);
            Location.sendAllTo(path);
        };

        Socket.on("cp:urls:update", $scope.updateVisited);
    }

})(angular);

