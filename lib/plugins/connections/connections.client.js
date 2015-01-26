(function (angular) {

    const SECTION_NAME = "connections";

    angular
        .module("BrowserSync")
        .controller("ConnectionsController", [
            "pagesConfig",
            ConnectionsControllers
        ]);

    /**
     * @param pagesConfig
     * @constructor
     */
    function ConnectionsControllers(pagesConfig) {
        var $scope = this;
        $scope.section = pagesConfig[SECTION_NAME];
    }

    angular
        .module("BrowserSync")
        .directive("connectionList", function () {
            return {
                restrict:    "E",
                scope:       {
                    options:     "="
                },
                templateUrl: "connections.directive.html",
                controller:  ["$scope", "$rootScope", "Clients", "Socket", connectionListDirective]
            };
        });

    /**
     * Controller for the URL sync
     * @param $scope - directive scope
     * @param $rootScope
     * @param Clients
     * @param Socket
     */
    function connectionListDirective($scope, $rootScope, Clients, Socket) {

        $scope.ui = {
            connections: []
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
        $scope.$on("$destroy", function () {
            Socket.off("cp:connections:update", $scope.update);
        });

        $scope.highlight = function (connection) {
            Clients.highlight(connection);
        };
    }

})(angular);

