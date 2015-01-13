/**
 *
 */
(function (angular) {

    var SECTION_NAME = "remote-debug";

    angular.module("BrowserSync")

        .controller("RemoteDebugController",
            ["$scope", "options", "Socket", "contentSections", RemoteDebugController]);

    /**
     * @param $scope
     * @param contentSections
     */
    function RemoteDebugController($scope, options, Socket, contentSections) {

        $scope.options   = options;
        $scope.section   = contentSections[SECTION_NAME];

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
                title: "CSS OUTLINING",
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

