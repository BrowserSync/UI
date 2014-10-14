/**
 *
 * Custom Notify module for Global notifications
 *
 */
angular.module('Notify', [])
    .directive("notifyElem", function () {
        return {
            restrict: "E",
            templateUrl: "js/templates/notify-elem.html",
            controller: ["$scope", "$rootScope", notifyController]
        };
    });

/**
 * Notify
 * @param $scope
 * @param $rootScope
 */
function notifyController ($scope, $rootScope) {

    /**
     * Default settings
     */
    var DEFAULT_STATUS  = "info";
    var DEFAULT_HEADING = "BrowserSync:";
    var DEFAULT_MESSAGE = "Welcome to BrowserSync";
    var DEFAULT_TIMEOUT = 2000;

    /**
     * Default state
     * @type {{visible: boolean, status: string, heading: string, text: string}}
     */
    $scope.ui = {
        visible: false,
        status:  DEFAULT_STATUS,
        heading: DEFAULT_HEADING,
        message: DEFAULT_MESSAGE
    };

    /**
     * @param evt
     * @param data
     */
    $scope.show = function (evt, data) {

        data = data || {};

        /**
         *
         * Clear any previous timers
         *
         */
        if ($scope._timer) {
            clearTimeout($scope._timer);
        }

        /**
         *
         * Set a reset timer
         *
         */
        $scope._timer = window.setTimeout($scope.reset, data.timeout || DEFAULT_TIMEOUT);

        /**
         *
         * Set UI flags
         *
         */
        $scope.ui.visible = true;
        $scope.ui.status  = data.status  || DEFAULT_STATUS;
        $scope.ui.heading = data.heading || DEFAULT_HEADING;
        $scope.ui.message = data.message || DEFAULT_HEADING;
    };

    /**
     * Reset the UI
     */
    $scope.reset = function () {
        $scope.ui.visible = false;
        $scope.$digest();
    };

    /**
     * Listen to events on the $rootScope
     */
    $rootScope.$on("notify:flash", $scope.show);
}