"use strict";

/**
 * @type {angular}
 */
var app    = require("../module");

/**
 * Main Ctrl
 */

app.controller("MainCtrl", ["$scope", "$route", "$location", "Socket", "$injector", MainCtrl]);

app.factory("SHANE", function () {
    return {
        shane: "ace"
    }
});

/**
 * @param $scope
 * @param Socket
 * @param $injector
 * @constructor
 */
function MainCtrl ($scope, $route, $location, Socket, $injector) {

    $scope.options  = false;
    $scope.browsers = [];
    $scope.socketId = "";


    var contentSections = $injector.get("contentSections");
    var ContentSections = $injector.get("ContentSections");

    $scope.ui = {
        menu:         contentSections,
        sectionMenu:  false,
        disconnected: false
    };

    /**
     * @param $section
     */
    $scope.setActiveSection = function ($section) {
        ContentSections.enable($section);
        $location.path($section.slug);
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

        /**
         * @param options
         */
        connection: function (options) {

            if (this.socket) {
                $scope.socketId = this.socket.sessionid;
            }
            $scope.update(options);
            $scope.$digest();
        },
        /**
         *
         */
        disconnect: function (data) {
            $scope.ui.disconnected = true;
        }
    };

    /**
     * Update the current $scope
     */
    $scope.update = function (options) {

        $scope.options = transformOptions(options);
        $scope.ui.disconnected = false;

        ContentSections.transform(contentSections["server-info"], function ($section) {
            $section.title = options.mode + " Info";
            return $section;
        });
    };

    Socket.on("connection", $scope.socketEvents.connection);
    Socket.on("disconnect", $scope.socketEvents.disconnect);
}

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