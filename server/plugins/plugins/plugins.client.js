/**
 *
 */
(function (angular) {

    var SECTION_NAME          = "plugins";
    var module                = angular.module("BrowserSync");
    var CONFIGURE_EVENT       = "cp:plugins:set";
    var CONFIGURE_MANY_EVENT  = "cp:plugins:setMany";

    module.controller("PluginsController", ["$scope", "options", "contentSections", "Socket", pluginsPageController]);

    /**
     * Controller for the URL sync
     * @param $scope
     * @param contentSections
     */
    function pluginsPageController($scope, options, contentSections, Socket) {

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

        /**
         * Set the state of many options
         * @param value
         */
        $scope.setMany = function (value) {
            Socket.emit(CONFIGURE_MANY_EVENT, value);
            $scope.ui.plugins = $scope.ui.plugins.map(function (item) {
                item.active = value;
                return item;
            });
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
     * @param Socket
     */
    function pluginsDirective($scope, Socket) {

        /**
         * Toggle a plugin
         */
        $scope.togglePlugin = function (plugin) {
            Socket.emit(CONFIGURE_EVENT, plugin);
        };
    }

})(angular);

