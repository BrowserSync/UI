/**
 *
 */
(function (angular) {

    var SECTION_NAME = "history";
    var module = angular.module("BrowserSync");

    module.controller("ConnectionsController",
        ["$scope", "options", "Socket", "$rootScope", "contentSections", connectionsControllers]);

    /**
     * @param $scope
     * @param options
     * @param Socket
     * @param contentSections
     */
    function connectionsControllers($scope, options, Socket, $rootScope, contentSections) {

        $scope.options = options;
        $scope.section = contentSections[SECTION_NAME];
        $scope.ui = {
            connections: {}
        };

        $scope.update = function (data) {
            $rootScope.$emit("connections:update", data);
            $scope.ui.connections = data;
            $scope.$digest();
        };

        // Always try to retreive the sockets first time.
        Socket.getData("clients").then(function (data) {
            $scope.ui.connections = data;
        });

        // Listen to events to update the list on the fly
        Socket.on("cp:connections:update", $scope.update);
        $scope.$on('$destroy', function () {
            Socket.off("cp:connections:update", $scope.update);
        });
    }

    module.directive("connectionList", function () {
        return {
            restrict:    "E",
            scope:       {
                options:     "=",
                connections: "="
            },
            templateUrl: "connections.directive.html",
            controller:  ["$scope", "Socket", "Location", connectionListDirective]
        }
    });

    /**
     * Controller for the URL sync
     * @param $scope - directive scope
     * @param Location
     */
    function connectionListDirective($scope, Socket, Location) {

        $scope.highlight = function (connection) {
            Socket.emit("cp:highlight", connection);
        };
    }

})(angular);

