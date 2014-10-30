/**
 *
 */
(function (angular) {

    angular.module("BrowserSync")
        .controller("PluginsController",
            ["$scope", "$rootScope", "Socket", "contentSections", pluginsController])
        .directive("pluginList", function () {
            return {
                restrict: "E",
                scope: {
                    options: "="
                },
                templateUrl: "plugins-list.html",
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

        /**
         * Watch the active property to show/hide
         */
        $scope.$watch(function () { return contentSections["plugins"].active }, function (data) {
            $scope.ui.active = data;
        });

        /**
         * @type {{loading: boolean}}
         */
        $scope.ui = {
            active:  contentSections["plugins"].active
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

