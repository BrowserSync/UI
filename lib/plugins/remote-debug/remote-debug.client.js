/**
 *
 */
(function (angular) {

    var SECTION_NAME = "remote-debug";

    angular.module("BrowserSync")

        .controller("RemoteDebugController",
            ["$scope", "options", "Socket", "pagesConfig", RemoteDebugController]);

    /**
     * @param $scope
     * @param options
     * @param Socket
     * @param pagesConfig
     */
    function RemoteDebugController($scope, options, Socket, pagesConfig) {

        $scope.options   = options;
        $scope.section   = pagesConfig[SECTION_NAME];

        $scope.items = [
            {
                name: "weinre",
                title: "Remote Debugger (weinre)",
                item: $scope.options["weinre"],
                tagline: "",
                hidden: "<a href=\"%s\" target=\"_blank\">Access remote debugger (opens in a new tab)</a></p>".replace("%s", $scope.options["weinre"].clientUrl)
            },
            {
                name:  "pesticide",
                title: "CSS Outlining",
                item: $scope.options["pesticide"],
                tagline: "Add simple CSS outlines to all elements. (powered by <a href=\"http://pesticide.io\">Pesticide.io</a>)"
            }
        ];

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
    }

})(angular);

