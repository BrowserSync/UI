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
        ctrl.selected    = ctrl.throttle.targets[0].name;
        ctrl.servers     = ctrl.throttle.servers;

        ctrl.port        = "";

        ctrl.createServer = function () {

            var item = getByProp(ctrl.throttle.targets, "name", ctrl.selected);

            Socket.emit("ui", {
                namespace: SECTION_NAME,
                event: "server:create",
                data: {
                    item: item,
                    port: ctrl.port
                }
            });

            // Set urls to an empty array while we create the server!
            if (!item.active) {
                item.urls = [];
            }
        };

        ctrl.destroyServer = function (name) {
            console.log(name);
        };

        ctrl.toggleSpeed = function (item) {
            if (!item.active) {
                item.urls = [];
            }
        };

        ctrl.update = function (data) {
            setTimeout(function () {
                ctrl.servers = data.servers;
                $scope.$digest();
            }, 1000);
        };

        function getByProp (collection, prop, match) {
            var match = collection.filter(function (item) {
                return item[prop] === match;
            });
            if (match.length) {
                return match[0];
            }
            return false;
        }

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