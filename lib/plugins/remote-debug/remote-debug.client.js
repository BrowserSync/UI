(function (angular) {

    const SECTION_NAME = "remote-debug";

    angular
        .module("BrowserSync")
        .controller("RemoteDebugController", [
            "options",
            "Socket",
            "pagesConfig",
            RemoteDebugController
        ]);

    /**
     * @param options
     * @param Socket
     * @param pagesConfig
     */
    function RemoteDebugController(options, Socket, pagesConfig) {

        var ctrl     = this;
        ctrl.options = options;
        ctrl.section = pagesConfig[SECTION_NAME];
        ctrl.items   = [
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
                item: ctrl.options["clientFiles"]["pesticide"],
                tagline: "Add simple CSS outlines to all elements. (powered by <a href=\"http://pesticide.io\">Pesticide.io</a>)"
            }
        ];

        ctrl.toggleDebugger = function (item) {
            if (item.name === "weinre") {
                return ctrl.toggleWeinre(item);
            }
            if (item.active) {
                return ctrl.enable(item);
            }
            return ctrl.disable(item);
        };

        ctrl.toggleWeinre = function (item) {
            Socket.emit("cp:weinre:toggle", item.active);
        };

        ctrl.enable = function (item) {
            Socket.emit("cp:clientfile:enable", item);
        };

        ctrl.disable = function (item) {
            Socket.emit("cp:clientfile:disable", item);
        };
    }

})(angular);

