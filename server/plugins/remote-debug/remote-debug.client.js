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

        $scope.options  = options;
        $scope.section  = contentSections[SECTION_NAME];
        $scope.debugger = $scope.options["remote-debug"];

        if (!$scope.options["remote-debug"]) {
            $scope.debugger = {
                active: false,
                url: false
            };
        }

        $scope.toggleDebugger = function (item) {
            if (item.active) {
                return $scope.enable();
            }
            return $scope.disable();
        };

        $scope.enable = function () {
            Socket.emit("cp:debugger:toggle", true);
        };

        $scope.disable = function () {
            Socket.emit("cp:debugger:toggle", false);
        };

        Socket.on("cp:debugger:enabled", function (data) {
            $scope.debugger = data;
            $scope.$digest();
        });
    }

})(angular);

