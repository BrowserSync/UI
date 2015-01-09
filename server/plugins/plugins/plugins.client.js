/**
 *
 */
(function (angular) {

    var SECTION_NAME = "plugins";
    var module = angular.module("BrowserSync");

    module.controller("PluginsController", ["$scope", "options", "contentSections", pluginsPageController]);

    /**
     * Controller for the URL sync
     * @param $scope
     * @param $rootScope
     * @param Socket
     * @param contentSections
     */
    function pluginsPageController($scope, options, contentSections) {
        $scope.options = options;
        $scope.section = contentSections[SECTION_NAME];

        /**
         * Don't show this control panel as user plugin
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
    }

    module.directive("pluginList", function () {
        return {
            restrict: "E",
            scope: {
                options: "=",
                plugins: "="
            },
            templateUrl: "plugins.directive.html",
            controller: ["$scope", "Socket", pluginsDirective]
        };
    });

    /**
     * @param $scope
     * @param $rootScope
     * @param Socket
     * @param contentSections
     */
    function pluginsDirective($scope, Socket) {

        var CONFIGURE_EVENT  = "plugins:configure";

        /**
         * Toggle a plugin
         */
        $scope.togglePlugin = function (plugin) {
            Socket.emit(CONFIGURE_EVENT, plugin);
        };
    }

})(angular);

