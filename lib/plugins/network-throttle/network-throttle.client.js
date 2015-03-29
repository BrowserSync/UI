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
     * @param Socket
     * @param $scope
     */
    function NetworkThrottleController (options, pagesConfig, Socket, $scope) {

        var ctrl         = this;

        ctrl.section     = pagesConfig[SECTION_NAME];
        ctrl.options     = options.bs;
        ctrl.uiOptions   = options.ui;
        ctrl.clientFiles = options.ui.clientFiles || {};
        ctrl.section     = pagesConfig[SECTION_NAME];

        ctrl.throttle    = ctrl.uiOptions[SECTION_NAME];
        ctrl.selected    = ctrl.throttle.targets[0].id;
        ctrl.servers     = ctrl.throttle.servers;
        ctrl.btnText     = "Create Server";
        ctrl.port        = "";
        ctrl.portEntry   = "auto";
        ctrl.serverCount = Object.keys(ctrl.servers).length;

        ctrl.state = {
            success: false,
            waiting: false
        };

        ctrl.createServer = function () {

            var item = getByProp(ctrl.throttle.targets, "id", ctrl.selected);

            if (ctrl.portEntry === "auto") {
                return send("");
            }

            if (!ctrl.port || !ctrl.port.length) {
                setError();
                return;
            }

            var port = parseInt(ctrl.port, 10);

            if (port < 1024 || port > 65535) {
                setError();
                return;
            }

            ctrl.state.waiting = true;
            ctrl.btnText = "please wait...";

            send(ctrl.port);

            function setError() {
                ctrl.state.waiting   = false;
                ctrl.state.portError = true;
            }

            function send (port) {

                Socket.emit("ui", {
                    namespace: SECTION_NAME,
                    event: "server:create",
                    data: {
                        speed: item,
                        port: port
                    }
                });
            }
        };

        ctrl.destroyServer = function (item, port) {
            Socket.emit("ui", {
                namespace: SECTION_NAME,
                event: "server:destroy",
                data: {
                    speed: item,
                    port: port
                }
            });
        };

        ctrl.toggleSpeed = function (item) {
            if (!item.active) {
                item.urls = [];
            }
        };

        ctrl.update = function (data) {

            ctrl.servers     = data.servers;
            ctrl.serverCount = Object.keys(ctrl.servers).length;

            if (data.event === "server:create") {
                updateButtonState();
            }

            $scope.$digest();
        };

        function updateButtonState() {

            ctrl.state.success = true;
            ctrl.btnText       = "Success";

            setTimeout(function () {

                setTimeout(function () {
                    ctrl.btnText = "Create Server";
                    ctrl.state.success = false;
                    ctrl.state.waiting = false;
                    $scope.$digest();
                }, 1000);

            }, 300);
        }

        /**
         * @param collection
         * @param prop
         * @returns {*}
         */
        function getByProp (collection, prop, name) {
            var match = collection.filter(function (item) {
                return item[prop] === name;
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
     */
    function throttleDirectiveControlller ($scope) {

        var ctrl = this;

        ctrl.throttle = $scope.options[SECTION_NAME];

    }

})(angular);