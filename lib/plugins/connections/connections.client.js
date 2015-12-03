(function (angular) {

    const SECTION_NAME = "connections";

    angular
        .module("BrowserSync")
        .controller("ConnectionsController", [
            "pagesConfig",
            "options",
            ConnectionsControllers
        ]);

    /**
     * @param pagesConfig
     * @constructor
     */
    function ConnectionsControllers(pagesConfig) {
        var ctrl = this;
        ctrl.section = pagesConfig[SECTION_NAME];
    }

    angular
        .module("BrowserSync")
        .directive("connectionList", function () {
            return {
                restrict:    "E",
                scope:       {
                    initial:     "="
                },
                templateUrl: "connections.directive.html",
                controller:  ["$scope", "Clients", "Socket", connectionListDirective],
                controllerAs: "ctrl"
            };
        });

    /**
     * Controller for the URL sync
     * @param $scope - directive scope
     * @param Clients
     * @param Socket
     */
    function connectionListDirective($scope, Clients, Socket) {

        var ctrl = this;
        /**
         * $scope.options.connections is the initial client list
         * emitted when the ui connects
         * @type {*|Array}
         */
        ctrl.connections = $scope.initial.connections;

        ctrl.update = function (data) {
            ctrl.connections = data;
            $scope.$digest();
        };

        // Listen to events to update the list on the fly
        Socket.on("ui:connections:update", ctrl.update);

        $scope.$on("$destroy", function () {
            Socket.off("ui:connections:update", ctrl.update);
        });
    }

    angular
        .module("BrowserSync")
        .directive("browser", function () {
            return {
                restrict: "E",
                scope: {
                    connection: "="
                },
                replace: true,
                templateUrl: "connections.browser.html",
                controller:  ["$scope", "Clients", "Socket", browserDirective],
                controllerAs: "ctrl"
            };
        });

    function browserDirective ($scope, Clients) {
        var ctrl = this;

        ctrl.highlight = function (connection) {
            Clients.highlight(connection.id);
        };

        ctrl.sendAllTo = function (connection, $event) {
            Clients.sendAllTo(connection.location.fullPath);
            connection._success = true;
            $event.target.blur();
            setTimeout(function () {
                connection._success = false;
                $scope.$digest();
            }, 1000);
        };
    }

})(angular);

