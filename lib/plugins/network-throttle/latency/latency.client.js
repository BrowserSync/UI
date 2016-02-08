(function (angular) {

    const SECTION_NAME = "network-throttle";

    /**
     * Display the snippet when in snippet mode
     */
    angular
        .module("BrowserSync")
        .directive("latency", function () {
            return {
                restrict:     "E",
                replace:      true,
                scope:        {
                    "options": "="
                },
                templateUrl:  "latency.html",
                controller:   ["$scope", "Socket", "$timeout", latencyDirectiveControlller],
                controllerAs: "ctrl"
            };
        });

    /**
     * @param $scope
     * @param Socket
     */
    function latencyDirectiveControlller($scope, Socket, $timeout) {

        var ctrl = this;
        var ns = SECTION_NAME + ":latency";

        ctrl.latency = $scope.options[SECTION_NAME]["latency"];
        ctrl.items = [
            {
                route: '/json',
                latency: 5000,
                active: true
            }
        ];

        ctrl.pause = function (item) {
            item.success = true;
            Socket.emit("ui", {
                namespace: ns,
                event:     "pause",
                data:      item
            });
            $timeout(function () {
                item.success = false;
            }, 1000);
        };

        ctrl.delete = function (item) {
            console.log('deleting', item);
            Socket.emit("ui", {
                namespace: ns,
                event:     "delete",
                data:      item
            });
        };

        //ctrl.alterLatency = function () {
        //    Socket.emit("ui", {
        //        namespace: ns,
        //        event:     "adjust",
        //        data:      {
        //            rate: ctrl.latency.rate
        //        }
        //    });
        //};
    }
})(angular);
