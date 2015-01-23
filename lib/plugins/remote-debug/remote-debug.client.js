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

        var ctrl = this;
        ctrl.options   = options;
        ctrl.section   = pagesConfig[SECTION_NAME];

        ctrl.items = [
            {
                name: "weinre",
                title: "Remote Debugger (weinre)",
                item: ctrl.options["weinre"],
                tagline: "",
                hidden: "<a href=\"%s\" target=\"_blank\">Access remote debugger (opens in a new tab)</a></p>".replace("%s", ctrl.options["weinre"].clientUrl)
            },
            {
                name:  "pesticide",
                title: "CSS Outlining",
                item: ctrl.options["pesticide"],
                tagline: "Add simple CSS outlines to all elements. (powered by <a href=\"http://pesticide.io\">Pesticide.io</a>)"
            }
        ];

        ctrl.toggleDebugger = function (item) {
            if (item.active) {
                return ctrl.enable(item.name);
            }
            return ctrl.disable(item.name);
        };

        ctrl.enable = function (name) {
            Socket.emit("cp:%s:toggle".replace("%s", name), true);
        };

        ctrl.disable = function (name) {
            Socket.emit("cp:%s:toggle".replace("%s", name), false);
        };
    }

})(angular);

