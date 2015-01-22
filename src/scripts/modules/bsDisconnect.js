(function () {

    angular
        .module("bsDisconnect", [])
        .directive("disconnectElem", function () {
            return {
                restrict: "E",
                scope: {},
                template: '<section bs-overlay ng-class="{\'active\': ui.visible}"><p><icon icon="block"></icon></p><h1>{{ui.heading}} {{ui.message}}</h1><p>Possible reasons are:</p><ul bs-list><li>1. Your process was exited by another tool</li></ul></section>', // jshint:ignore
                controller: ["$scope", "$rootScope", "$window", disconnectController]
            };
        });

    /**
     * Disconnect
     * @param $scope
     * @param $rootScope
     * @param $window
     */
    function disconnectController ($scope, $rootScope, $window) {

        /**
         * Default settings
         */
        const DEFAULT_HEADING = "BrowserSync";
        const DEFAULT_MESSAGE = "Disconnected";

        $scope._disconnected  = false;

        /**
         * Default state
         * @type {{visible: boolean, status: string, heading: string, text: string}}
         */
        $scope.ui = {
            visible: false,
            heading: DEFAULT_HEADING,
            message: DEFAULT_MESSAGE
        };

        /**
         * @type {{connection: Function, disconnect: Function}}
         */
        $scope.socketEvents = {
            connection: function () {
                if ($scope._disconnected) {
                    $window.location.reload(true);
                }
                $scope.ui.visible = false;
                $scope.$digest();
            },
            disconnect: function () {
                $scope._disconnected = true;
                $scope.ui.visible = true;
                $scope.$digest();
            }
        };

        $rootScope.$on("cp:connection", $scope.socketEvents.connection);
        $rootScope.$on("cp:disconnect", $scope.socketEvents.disconnect);
    }

})(angular);

