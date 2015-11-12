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

        ctrl.highlight = function (connection) {
            console.log(connection);
            Clients.highlight(connection);
        };
    }

    angular
        .module("BrowserSync")
        .directive("browser", function () {
            return {
                restrict: "E",
                scope: {
                    browser: "="
                },
                replace: true,
                templateUrl: "connections.browser.html",
                controller:  ["$scope", "Clients", "Socket", browserDirective],
                controllerAs: "ctrl"
            };
        });

    function browserDirective ($scope) {
        var ctrl = this;
        ctrl.browser = $scope.browser;
    }

})(angular);

