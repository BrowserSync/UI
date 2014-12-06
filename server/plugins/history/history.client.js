/**
 *
 */
(function (angular) {

    var SECTION_NAME = "history";

    angular.module("BrowserSync")

        .controller("HistoryController",
            ["$scope", "$rootScope", "Socket", "contentSections", historyController])

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
    function historyController($scope, $rootScope, Socket, contentSections) {
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
         * Emit the socket event
         */
        $scope.sendAllTo = function (url) {
            Location.sendAllTo(url.path);
        };

        /**
         * Emit the reload-all event
         */
        $scope.reloadAll = function (url) {

        };

        /**
         *
         */
        $scope.updateVisited = function (data) {
            $scope.urls.visited = data;
            $scope.$digest();
        };

        /**
         * Set the loading state
         * @param name
         */
        $scope.setLoading = function (name) {
            $scope.ui.loading       = true;
            $scope.ui.loaders[name] = true;
        };

        Socket.on("cp:urls:update", $scope.updateVisited);
    }

})(angular);

