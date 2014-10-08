"use strict";

/**
 * @type {angular}
 */
var app    = require("../module");

/**
 * Main Ctrl
 */
app.controller("MainCtrl", function ($scope, Socket, $injector) {

    $scope.options = false;
    $scope.browsers = [];
    $scope.socketId = "";

    var contentSections = $injector.get("contentSections");
    var ContentSections = $injector.get("ContentSections");

    $scope.ui = {
        menu: contentSections,
        sectionMenu: false
    };

    /**
     * @param $section
     */
    $scope.setActiveSection = function ($section) {
        ContentSections.enable($section);
        $scope.ui.sectionMenu = false;
    };

    /**
     *
     */
    $scope.toggleMenu = function () {
        $scope.ui.sectionMenu = !$scope.ui.sectionMenu;
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

                $scope.update(options);

            });
        },
        addBrowsers: function (browsers) {
            $scope.$apply(function () {

            });
        }
    };

    /**
     * Update the current $scope
     */
    $scope.update = function (options) {

        $scope.options = transformOptions(options);

        ContentSections.transform(contentSections["server-info"], function ($section) {
            $section.title = options.mode + " Info";
            return $section;
        });
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