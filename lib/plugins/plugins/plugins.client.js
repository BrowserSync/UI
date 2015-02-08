/**
 *
 */
(function (angular) {

    var SECTION_NAME          = "plugins";
    var CONFIGURE_EVENT       = "ui:plugins:set";
    var CONFIGURE_MANY_EVENT  = "ui:plugins:setMany";

    angular
        .module("BrowserSync")
        .controller("PluginsController", [
            "options",
            "Socket",
            "pagesConfig",
            PluginsPageController
        ]);

    /**
     * @param options
     * @param Socket
     * @param pagesConfig
     * @constructor
     */
    function PluginsPageController(options, Socket, pagesConfig) {

        var ctrl = this;
        ctrl.options = options;
        ctrl.section = pagesConfig[SECTION_NAME];

        /**
         * Don't show this UI as user plugin
         */
        var filtered = ctrl.options.userPlugins.filter(function (item) {
            return item.name !== "UI";
        });

        /**
         * @type {{loading: boolean}}
         */
        ctrl.ui = {
            loading: false,
            plugins: filtered
        };

        /**
         * Set the state of many options
         * @param value
         */
        ctrl.setMany = function (value) {
            Socket.emit(CONFIGURE_MANY_EVENT, value);
            ctrl.ui.plugins = ctrl.ui.plugins.map(function (item) {
                item.active = value;
                return item;
            });
        };
    }


    angular
        .module("BrowserSync")
        .directive("pluginList", function () {
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

