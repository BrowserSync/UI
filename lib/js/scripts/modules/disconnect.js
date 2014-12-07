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
            template: '<section bs-Overlay ng-class="{\'active\': ui.visible}"><p><i bs-Icon="block" bs-Icon-Size="jumbo"></i></p><h1 bs-Weight="light">{{ui.heading}} {{ui.message}}</h1><p>Possible reasons are:</p><ul bs-List><li>1. Your process was exited by another tool</li></ul></div>',
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
                window.location.reload(true);
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