/**
 *
 */
(function (angular) {

    var SECTION_NAME          = "plugins";

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
        ctrl.section = pagesConfig[SECTION_NAME];

        ctrl.options     = options.bs;
        ctrl.uiOptions   = options.ui;

        /**
         * Don't show this UI as user plugin
         */
        var filtered = ctrl.options.userPlugins.filter(function (item) {
            return item.name !== "UI";
        }).map(function (item) {
            item.title = item.name;
            return item;
        });

        /**
         * @type {{loading: boolean}}
         */
        ctrl.ui = {
            loading: false,
            plugins: filtered
        };

        /**
         * Toggle a plugin
         */
        ctrl.togglePlugin = function (plugin) {
            Socket.emit("ui", {
                namespace: SECTION_NAME,
                event: "set",
                data: plugin
            });
        };

        /**
         * Set the state of many options
         * @param value
         */
        ctrl.setMany = function (value) {
            Socket.emit("ui", {
                namespace: SECTION_NAME,
                event: "setMany",
                data: value
            });
            ctrl.ui.plugins = ctrl.ui.plugins.map(function (item) {
                item.active = value;
                return item;
            });
        };
    }

})(angular);

