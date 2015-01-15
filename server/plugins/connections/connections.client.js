/**
 *
 */
(function (angular) {

    var SECTION_NAME = "history";
    var module = angular.module("BrowserSync");

    module.controller("ConnectionsController",
        ["$scope", "options", "Socket", "contentSections", connectionsControllers]);

    /**
     * @param $scope
     * @param options
     * @param contentSections
     */
    function connectionsControllers($scope, options, Socket, contentSections) {

        $scope.options = options;
        $scope.section = contentSections[SECTION_NAME];
        $scope.ui = {
            connections: [
                {
                    browser: "Chrome"
                },
                {
                    browser: "Firefox"
                }
            ]
        };

    }

    module.directive("connectionList", function () {
        return {
            restrict:    "E",
            scope:       {
                options:     "=",
                connections: "="
            },
            templateUrl: "connections.directive.html",
            controller:  ["$scope", "Location", connectionListDirective]
        }
    });

    /**
     * Controller for the URL sync
     * @param $scope - directive scope
     * @param Location
     */
    function connectionListDirective($scope, Location) {

        //$scope.removeVisited = function (data) {
        //    Location.remove(data);
        //};
        //
        ///**
        // * Emit the socket event
        // */
        //$scope.sendAllTo = function (path) {
        //    Location.sendAllTo(path);
        //};
    }

})(angular);

