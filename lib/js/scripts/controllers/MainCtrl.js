"use strict";

var socket = require("../socket");

/**
 * @type {angular}
 */
var app    = require("../module");

/**
 * Main Ctrl
 */
app.controller("MainCtrl", function ($scope, removeCpFilter, Socket) {

    $scope.options = false;
    $scope.browsers = [];
    $scope.socketId = "";

    $scope.ui = {
        snippet: false
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
                $scope.options = options;
                if ($scope.options.snippet) {
                    $scope.options.snippet = $scope.options.snippet.replace(/\n/g, "");
                }
            });
        },
        addBrowsers: function (browsers) {
            $scope.$apply(function () {
                $scope.browsers = removeCpFilter(browsers, $scope.socketId);
            });
        }
    };

    /**
     *
     */
    $scope.toggleSnippet = function () {
        $scope.ui.snippet = !$scope.ui.snippet;
    };

    /**
     * @param url
     */
    $scope.goTo = function (url) {
        socket.emit("cp:goTo", {url: url});
    };

    Socket.addEvent("connection", $scope.socketEvents.connection);
    Socket.addEvent("cp:browser:update", $scope.socketEvents.addBrowsers);
});