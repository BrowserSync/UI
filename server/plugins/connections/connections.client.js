/**
 *
 */
(function (angular) {

    var SECTION_NAME = "history";
    var module = angular.module("BrowserSync");

    module.controller("ConnectionsController", [
        "options",
        "Socket",
        "$rootScope",
        "contentSections",
        function connectionsControllers(options, Socket, $rootScope, contentSections) {

            var $scope = this;
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
    ]);

    module.directive("connectionList", function () {
        return {
            restrict:    "E",
            scope:       {
                options:     "=",
                connections: "="
            },
            templateUrl: "connections.directive.html",
            controller:  ["$scope", "Clients", connectionListDirective]
        };
    });

    /**
     * Controller for the URL sync
     * @param $scope - directive scope
     * @param Clients
     */
    function connectionListDirective($scope, Clients) {

        $scope.highlight = function (connection) {
            Clients.highlight(connection);
        };
    }

})(angular);

