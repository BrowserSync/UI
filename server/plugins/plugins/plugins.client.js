/**
 *
 */
(function (angular) {

    angular.module("BrowserSync")

        .directive("plugins", function () {
            return {
                restrict: "E",
                scope: {
                    options: "="
                },
                templateUrl: "templates/plugins.html",
                controller: ["$scope", "$rootScope", "Socket", "contentSections", pluginsController]
            };
        });

    /**
     * Controller for the URL sync
     * @param $scope
     * @param $rootScope
     * @param Socket
     * @param contentSections
     */
    function pluginsController($scope, $rootScope, Socket, contentSections) {

        var CONFIGURE_EVENT  = "plugins:configure";

        /**
         *
         */
        $scope.$watch(function () {
            return contentSections["plugins"].active
        }, function (data) {
            $scope.ui.active = data;
        });

        /**
         * @type {{loading: boolean}}
         */
        $scope.ui = {
            loading: false,
            plugins: $scope.options.userPlugins,
            active: contentSections["plugins"].active
        };

        /**
         * Toggle a plugin
         */
        $scope.togglePlugin = function (plugin) {
            Socket.emit(CONFIGURE_EVENT, plugin);
        };
    }

    /**
     * Let the user know shit is happening
     */
    function notify($scope, $rootScope) {

        $scope.resetLoaders();

        $rootScope.$broadcast("notify:flash", {
            heading: "Instruction Sent:",
            message: "Reload all browsers..",
            status: "error",
            timeout: 2000
        });

        $scope.$digest();
    }
})(angular);

