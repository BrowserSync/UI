(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/**
 * @type {angular}
 */
var app    = require("../module");

/**
 * Main Ctrl
 */
app.controller("MainCtrl", function ($scope, Socket, $injector) {

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
},{"../module":4}],2:[function(require,module,exports){
require("./MainCtrl");

},{"./MainCtrl":1}],3:[function(require,module,exports){
"use strict";

/* jshint ignore:start */
var module      = angular.module("BrowserSync", ["Notify", "Socket", "ngOrderObjectBy"]);

/**
 * Modules
 * @type {exports}
 */
var notify      = require("./modules/notify");
var socket      = require("./modules/socket");

var app         = require("./services");
var Controllers = require("./controllers");
/* jshint ignore:end */
},{"./controllers":2,"./modules/notify":5,"./modules/socket":6,"./services":8}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
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

    .service("Socket", function () {

        return {
            on: function (name, callback) {
                socket.on(name, callback);
            },
            removeEvent: function (name, callback) {
                socket.removeListener(name, callback);
            },
            emit: function (name, data) {
                socket.emit(name, data || {});
            }
        };
    });
},{}],7:[function(require,module,exports){
/**
 * @type {angular}
 */
var app = require("../module");

/**
 * Default contentSections
 */
app.value("contentSections", {
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
    },
    "plugins": {
        title: "Plugins",
        active: false,
        order: 4
    }
});

/**
 *
 */
app.service("ContentSections", ["contentSections", ContentSections]);

/**
 * @param contentSections
 * @returns {{enable: enable, transform: transform}}
 * @constructor
 */
function ContentSections(contentSections) {

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
        }
    }
}
},{"../module":4}],8:[function(require,module,exports){
require("./ContentSections");
},{"./ContentSections":7}]},{},[3])