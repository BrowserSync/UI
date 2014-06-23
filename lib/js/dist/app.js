(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var socket = require("./socket");

/**
 * @type {angular}
 */
var app    = require("./module");

/**
 * Socket Factory
 */
app.service("Socket", function () {
    return {
        addEvent: function (name, callback) {
            socket.on(name, callback);
        },
        removeEvent: function (name, callback) {
            socket.removeListener(name, callback);
        }
    };
});


/**
 * Options Factory
 */
app.service("Options", function () {
    return {

    };
});

/**
 * URL info header
 */
app.directive("urlInfo", function () {
    return {
        restrict: "E",
        scope: {
            options: "="
        },
        template: "<h1><small>{{type}} running at: </small><a href=\"{{url}}\" target='_blank'>{{url}}</a></h1>",
        controller: function ($scope) {
            $scope.url  = $scope.options.url;
            $scope.type = $scope.options.server ? "Server" : "Proxy";
        }
    };
});

/**
 * Remove control panel from list of items
 */
app.filter("removeCp", function () {
    return function (items, id) {
        var filtered = [];
        items.forEach(function (item) {
            if (item.id !== id) {
                filtered.push(item);
            }
        });
        return filtered;
    };
});

},{"./module":4,"./socket":5}],2:[function(require,module,exports){
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
                $scope.options.snippet = $scope.options.snippet.replace("\n", "");
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
},{"../module":4,"../socket":5}],3:[function(require,module,exports){
"use strict";

/* jshint ignore:start */
var module   = angular.module("BrowserSync", []);

var app      = require("./app");
var MainCtrl = require("./controllers/MainCtrl");
/* jshint ignore:end */
},{"./app":1,"./controllers/MainCtrl":2}],4:[function(require,module,exports){
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
"use strict";

/*global window*/

/**
 * @type {{emit: emit, on: on}}
 */
module.exports = window.___socket___ || {
    emit: function(){},
    on: function(){},
    removeListener: function(){}
};

},{}]},{},[3])