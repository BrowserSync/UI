(function (angular) {

    const SECTION_NAME = "remote-debug";

    angular
        .module("BrowserSync")
        .controller("RemoteDebugController", [
            "$scope",
            "options",
            "Socket",
            "pagesConfig",
            RemoteDebugController
        ]);

    /**
     * @param options
     * @param Socket
     * @param pagesConfig
     */
    function RemoteDebugController($scope, options, Socket, pagesConfig) {

        var ctrl         = this;
        ctrl.options     = options.bs;
        ctrl.uiOptions   = options.ui;
        ctrl.clientFiles = options.ui.clientFiles || {};
        ctrl.section     = pagesConfig[SECTION_NAME];
        ctrl.items = [];

        if (Object.keys(ctrl.clientFiles).length) {
            Object.keys(ctrl.clientFiles).forEach(function (key) {
                if (ctrl.clientFiles[key].context === SECTION_NAME) {
                    ctrl.items.push(ctrl.clientFiles[key]);
                }
            });
        }

        ctrl.latency      = ctrl.uiOptions["remote-debug"]["latency"];

        ctrl.alterLatency = function () {
            Socket.emit("cp:latency:adjust", ctrl.latency.rate);
        };

        ctrl.toggleDebugger = function (item) {
            if (item.name === "latency") {
                return ctrl.toggleLatency(item);
            }
            if (item.name === "weinre") {
                return ctrl.toggleWeinre(item);
            }
            if (item.active) {
                return ctrl.enable(item);
            }
            return ctrl.disable(item);
        };

        ctrl.toggleWeinre = function (item) {
            Socket.emit("cp:weinre:toggle", item.active);
        };

        ctrl.toggleLatency = function (item) {
            Socket.emit("cp:latency:toggle", item.active);
        };

        ctrl.enable = function (item) {
            Socket.emit("cp:clientfile:enable", item);
        };

        ctrl.disable = function (item) {
            Socket.emit("cp:clientfile:disable", item);
        };

        $scope.$on("$destroy", function () {
            Socket.emit("cp:latency:save");
        })
    }

})(angular);

