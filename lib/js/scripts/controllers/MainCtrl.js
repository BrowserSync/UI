"use strict";

/**
 * @type {angular}
 */
var app    = require("../module");

/**
 * Main Ctrl
 */
app.controller("MainCtrl", function ($scope, Socket) {

    $scope.options = false;
    $scope.browsers = [];
    $scope.socketId = "";

    $scope.ui = {
        snippet: false,
        menu: {
            "server-info": {
                title: "Server Info",
                active: true,
                order: 1
            },
            "ghostmode": {
                title: "GhostMode Options",
                active: false,
                order: 2
            },
            "locations": {
                title: "Locations",
                active: false,
                order: 3
            }
        }
    };

    /**
     * @param $section
     */
    $scope.setActiveSection = function ($section) {
        angular.forEach($scope.ui.menu, function (item) {
            item.active = false;
        });
        $section.active = true;
    };

    /**
     * @type {{connection: connection, addBrowsers: addBrowsers}}
     */
    $scope.socketEvents = {

        connection: function (options) {

            var _this = this;

            $scope.$apply(function () {

                if (_this.socket) {
                    $scope.socketId = _this.socket.sessionid;
                }

                $scope.options = transformOptions(options);

                $scope.ui.snippet = $scope.options.mode === "Snippet"
            });
        },
        addBrowsers: function (browsers) {
            $scope.$apply(function () {

            });
        }
    };

    Socket.addEvent("connection", $scope.socketEvents.connection);
});

/**
 * Options transformations
 * @param options
 * @returns {*}
 */
function transformOptions(options) {

    var mode = "Snippet";

    if (options.server) {
        mode = "Server";
    }

    if (options.proxy) {
        mode = "Proxy";
    }

    options.mode = mode;

    return options;
}