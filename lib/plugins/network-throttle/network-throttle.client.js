(function (angular) {

    const SECTION_NAME = "network-throttle";

    angular
        .module("BrowserSync")
        .controller("NetworkThrottleController", [
            "options",
            "pagesConfig",
            "Socket",
            "$scope",
            NetworkThrottleController
        ]);

    /**
     * @param options
     * @param pagesConfig
     */
    function NetworkThrottleController (options, pagesConfig, Socket, $scope) {

        var ctrl         = this;

        ctrl.section     = pagesConfig[SECTION_NAME];
        ctrl.options     = options.bs;
        ctrl.uiOptions   = options.ui;
        ctrl.clientFiles = options.ui.clientFiles || {};
        ctrl.section     = pagesConfig[SECTION_NAME];
        ctrl.throttle    = ctrl.uiOptions[SECTION_NAME];

        ctrl.toggleSpeed = function (item) {
            Socket.emit("ui", {
                namespace: SECTION_NAME,
                event: "toggle:speed",
                data: item
            });
            if (!item.active) {
                item.urls = [];
            }
        };

        ctrl.update = function (data) {
            setTimeout(function () {
                ctrl.throttle.targets[data.name] = data.target;
                $scope.$digest();
            }, 1000);
        };

        Socket.on("ui:network-throttle:update", ctrl.update);
        $scope.$on("$destroy", function () {
            Socket.off("ui:network-throttle:update", ctrl.update);
        });
    }

    /**
     * Display the snippet when in snippet mode
     */
    angular
        .module("BrowserSync")
        .directive("throttle", function () {
            return {
                restrict: "E",
                replace: true,
                scope: {
                    "target": "=",
                    "options": "="
                },
                templateUrl: "network-throttle.directive.html",
                controller: ["$scope", "Socket", throttleDirectiveControlller],
                controllerAs: "ctrl"
            };
        });

    /**
     * @param $scope
     * @param Socket
     */
    function throttleDirectiveControlller ($scope) {

        var ctrl = this;

        ctrl.throttle = $scope.options[SECTION_NAME];

    }

})(angular);