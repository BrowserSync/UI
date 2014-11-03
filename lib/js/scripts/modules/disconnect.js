/**
 *
 * Custom Notify module for Global notifications
 *
 */
angular.module('Disconnect', [])

    .directive("disconnectElem", function () {

        return {
            restrict: "E",
            scope: {},
            template: '<div class="bs-disconnect" ng-class="{\'active\': ui.visible}"><h1>{{ui.heading}}</h1><h2>{{ui.message}}</h2></div>',
            controller: ["$scope", "$rootScope", "Socket", disconnectController]
        };
    });

/**
 * Disconnect
 * @param $scope
 * @param $rootScope
 */
function disconnectController ($scope, $rootScope, Socket) {

    /**
     * Default settings
     */
    const DEFAULT_HEADING = "BrowserSync";
    const DEFAULT_MESSAGE = "Disconnected";

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
            $scope.ui.visible = false;
            $scope.$digest();
        },
        disconnect: function () {
            $scope.ui.visible = true;
            $scope.$digest();
        }
    }

    $rootScope.$on("cp:connection", $scope.socketEvents.connection);
    $rootScope.$on("cp:disconnect", $scope.socketEvents.disconnect);
}