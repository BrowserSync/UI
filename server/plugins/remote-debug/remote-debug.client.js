/**
 *
 */
(function (angular) {

    var SECTION_NAME = "remote-debug";

    angular.module("BrowserSync")

        .controller("RemoteDebugController",
            ["$scope", "options", "Socket", "contentSections", RemoteDebugController])

    /**
     * @param $scope
     * @param contentSections
     */
    function RemoteDebugController($scope, options, Socket, contentSections) {

        $scope.options   = options;
        $scope.section   = contentSections[SECTION_NAME];

        $scope.items = {
            weinre:    $scope.options["weinre"],
            pesticide: $scope.options["pesticide"]
        };

        $scope.toggleDebugger = function (item) {
            if (item.active) {
                return $scope.enable(item.name);
            }
            return $scope.disable(item.name);
        };

        $scope.enable = function (name) {
            Socket.emit("cp:%s:toggle".replace("%s", name), true);
        };

        $scope.disable = function (name) {
            Socket.emit("cp:%s:toggle".replace("%s", name), false);
        };

        Socket.on("cp:weinre:enabled", function (data) {
            $scope.items.weinre = data;
            $scope.$digest();
        });
        Socket.on("cp:weinre:disabled", function (data) {
            $scope.items.weinre = false;
            $scope.$digest();
        });
    }

})(angular);

