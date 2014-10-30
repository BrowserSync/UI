(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/**
 * @type {angular}
 */
var app    = require("./module");

/**
 * Main Ctrl
 */

app.controller("MainCtrl", ["$scope", "$route", "$location", "Socket", "$injector", "$q", MainCtrl]);

/**
 * @param $scope
 * @param Socket
 * @param $injector
 * @constructor
 */
function MainCtrl ($scope, $route, $location, Socket, $injector, $q) {

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
        $location.path($section.path);
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
        connection: function (options, socket) {

            if (socket) {
                $scope.socketId = socket.socket.sessionid;
            }
            $scope.update(options);
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

    /**
     * Set the currently active page
     */
    $scope.setActiveSection(ContentSections.current());

    /**
     * Get options from socket connection
     */
    Socket.options().then($scope.socketEvents.connection);

    /**
     * React to disconnects
     */
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
},{"./module":3}],2:[function(require,module,exports){
"use strict";

/* jshint ignore:start */
var module      = angular.module("BrowserSync", ["Notify", "Socket", "ngOrderObjectBy", "ngRoute"]);

/**
 * Route Configuration
 */
module.config(["$routeProvider", "$locationProvider", Config]);

/**
 * @param $routeProvider
 * @constructor
 */
function Config ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}

/**
 * Modules
 * @type {exports}
 */
var notify      = require("./modules/notify");
var socket      = require("./modules/socket");

var app         = require("./services/ContentSections");
var Controllers = require("./MainCtrl");
/* jshint ignore:end */
},{"./MainCtrl":1,"./modules/notify":4,"./modules/socket":5,"./services/ContentSections":6}],3:[function(require,module,exports){
"use strict";

/*global angular*/

/**
 * @type {angular}
 */
var app = angular.module("BrowserSync");

/**
 * @type {angular}
 */
module.exports = app;
},{}],4:[function(require,module,exports){
/**
 *
 * Custom Notify module for Global notifications
 *
 */
angular.module('Notify', [])

    .directive("notifyElem", function () {

        return {
            restrict: "E",
            templateUrl: "js/templates/notify-elem.html",
            controller: ["$scope", "$rootScope", notifyController]
        };
    });

/**
 * Notify
 * @param $scope
 * @param $rootScope
 */
function notifyController ($scope, $rootScope) {

    /**
     * Default settings
     */
    var DEFAULT_STATUS  = "info";
    var DEFAULT_HEADING = "BrowserSync:";
    var DEFAULT_MESSAGE = "Welcome to BrowserSync";
    var DEFAULT_TIMEOUT = 2000;

    /**
     * Default state
     * @type {{visible: boolean, status: string, heading: string, text: string}}
     */
    $scope.ui = {
        visible: false,
        status:  DEFAULT_STATUS,
        heading: DEFAULT_HEADING,
        message: DEFAULT_MESSAGE
    };

    /**
     * @param evt
     * @param data
     */
    $scope.show = function (evt, data) {

        data = data || {};

        /**
         *
         * Clear any previous timers
         *
         */
        if ($scope._timer) {
            clearTimeout($scope._timer);
        }

        /**
         *
         * Set a reset timer
         *
         */
        $scope._timer = window.setTimeout($scope.reset, data.timeout || DEFAULT_TIMEOUT);

        /**
         *
         * Set UI flags
         *
         */
        $scope.ui.visible = true;
        $scope.ui.status  = data.status  || DEFAULT_STATUS;
        $scope.ui.heading = data.heading || DEFAULT_HEADING;
        $scope.ui.message = data.message || DEFAULT_HEADING;
    };

    /**
     * Reset the UI
     */
    $scope.reset = function () {
        $scope.ui.visible = false;
        $scope.$digest();
    };

    /**
     * Listen to events on the $rootScope
     */
    $rootScope.$on("notify:flash", $scope.show);
}
},{}],5:[function(require,module,exports){
/**
 * @type {{emit: emit, on: on}}
 */
var socket = window.___browserSync___.socket || {

    emit: function () {},
    on: function () {},
    removeListener: function () {}
};

/**
 * Custom Notify module for Global notifications
 */
angular.module('Socket', [])

    .service("Socket", ["$q", function ($q) {

        var deferred = $q.defer();

        socket.on("connection", function (out) {
            deferred.resolve(out, this);
        });

        return {
            on: function (name, callback) {
                socket.on(name, callback);
            },
            removeEvent: function (name, callback) {
                socket.removeListener(name, callback);
            },
            emit: function (name, data) {
                socket.emit(name, data || {});
            },
            options: function () {
                return deferred.promise;
            }
        };
    }]);
},{}],6:[function(require,module,exports){
/**
 * @type {angular}
 */
var app = require("../module");

app.service("ContentSections", ["contentSections", "$location", ContentSections]);

/**
 * @param contentSections
 * @returns {{enable: enable, transform: transform}}
 * @constructor
 */
function ContentSections(contentSections, $location) {

    return {
        /**
         * Enable a single Item
         * @param $section
         * @returns {*}
         */
        enable: function ($section) {
            angular.forEach(contentSections, function (item) {
                item.active = false;
            });
            $section.active = true;
            return contentSections;
        },
        /**
         * Transform an item
         */
        transform: function ($section, fn) {
            if (typeof fn === "function") {
                return $section = fn($section);
            } else {
                throw new TypeError("Noooo");
            }
        },
        /**
         * Get the current section based on the path
         * @returns {*}
         */
        current: function () {
            if ($location.path() === "/") {
                return contentSections["server-info"];
            }
            var match;
            angular.forEach(contentSections, function (item) {
                if (item.path === $location.path()) {
                    match = item;
                }
            });
            return match;
        }
    }
}
},{"../module":3}]},{},[2])