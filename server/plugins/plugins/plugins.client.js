/**
 *
 */
(function (angular) {

    var SECTION_NAME = "plugins";

    angular.module("BrowserSync")
        .controller("PluginsController",
            ["$scope", "$rootScope", "Socket", "contentSections", pluginsController])
        .directive("pluginList", function () {
            return {
                restrict: "E",
                scope: {
                    options: "="
                },
                templateUrl: "templates/plugins.directive.html",
                controller: ["$scope", "Socket", "contentSections", pluginsDirective]
            };
        });

    /**
     * @param $scope
     * @param $rootScope
     * @param Socket
     * @param contentSections
     */
    function pluginsDirective($scope, Socket, contentSections) {

        var CONFIGURE_EVENT  = "plugins:configure";

        /**
         * Don't show control panel as user plugin
         */
        var filtered = $scope.options.userPlugins.filter(function (item) {
            return item.name !== "Control Panel";
        });

        /**
         * @type {{loading: boolean}}
         */
        $scope.ui = {
            loading: false,
            plugins: filtered
        };

        /**
         * Toggle a plugin
         */
        $scope.togglePlugin = function (plugin) {
            Socket.emit(CONFIGURE_EVENT, plugin);
        };
    }

    /**
     * Controller for the URL sync
     * @param $scope
     * @param $rootScope
     * @param Socket
     * @param contentSections
     */
    function pluginsController($scope, $rootScope, Socket, contentSections) {
        $scope.section = contentSections[SECTION_NAME];
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

