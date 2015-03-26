(function (angular) {

    const SECTION_NAME = "network-throttle";

    angular
        .module("BrowserSync")
        .controller("NetworkThrottleController", [
            "options",
            "pagesConfig",
            NetworkThrottleController
        ]);

    /**
     * @param options
     * @param pagesConfig
     */
    function NetworkThrottleController (options, pagesConfig) {
        var ctrl         = this;
        ctrl.section     = pagesConfig[SECTION_NAME];
        ctrl.options     = options.bs;
        ctrl.uiOptions   = options.ui;
        ctrl.clientFiles = options.ui.clientFiles || {};
        ctrl.section     = pagesConfig[SECTION_NAME];
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
    function throttleDirectiveControlller ($scope, Socket) {

        var ctrl = this;

        ctrl.throttle = $scope.options[SECTION_NAME];

        ctrl.toggleThrottle = function (item) {
            Socket.emit("ui:throttle", {
                event: "toggle",
                data: item.active
            });
        };

        ctrl.toggleSpeed = function (item) {
            Socket.emit("ui:throttle", {
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

})(angular);