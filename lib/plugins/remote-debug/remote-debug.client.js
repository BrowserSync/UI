(function (angular) {

    const SECTION_NAME = "remote-debug";

    angular
        .module("BrowserSync")
        .controller("RemoteDebugController", [
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
    function RemoteDebugController(options, Socket, pagesConfig) {

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

        ctrl.toggleDebugger = function (item) {
            if (item.name === "weinre") {
                return ctrl.toggleWeinre(item);
            }
            if (item.active) {
                return ctrl.enable(item);
            }
            return ctrl.disable(item);
        };

        ctrl.toggleWeinre = function (item) {
            Socket.emit("ui:weinre:toggle", item.active);
        };

        ctrl.enable = function (item) {
            Socket.emit("ui:clientfile:enable", item);
        };

        ctrl.disable = function (item) {
            Socket.emit("ui:clientfile:disable", item);
        };
    }

    /**
     * Display the snippet when in snippet mode
     */
    angular
        .module("BrowserSync")
        .directive("latency", function () {
            return {
                restrict: "E",
                replace: true,
                scope: {
                    "options": "="
                },
                templateUrl: "latency.html",
                controller: ["$scope", "Socket", latencyDirectiveControlller],
                controllerAs: "ctrl"
            };
        });

    /**
     * @param $scope
     * @param Socket
     */
    function latencyDirectiveControlller ($scope, Socket) {

        var ctrl = this;

        ctrl.latency = $scope.options[SECTION_NAME]["latency"];

        ctrl.alterLatency = function () {
            Socket.emit("ui:latency", {
                event: "adjust",
                data: {
                    rate: ctrl.latency.rate
                }
            });
        };

        ctrl.toggleLatency = function (item) {
            Socket.emit("ui:latency", {
                event: "toggle",
                data: item.active
            });
        };
    }

})(angular);

