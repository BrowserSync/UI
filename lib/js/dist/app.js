(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"../module":7}],2:[function(require,module,exports){
require("./MainCtrl");

},{"./MainCtrl":1}],3:[function(require,module,exports){
require("./url-info");
require("./snippet-info");
},{"./snippet-info":4,"./url-info":5}],4:[function(require,module,exports){
/**
 * @type {angular}
 */
var app       = require("../module");
var utils     = require("../utils");

/**
 * Snippet info
 */
app.directive("snippetInfo", function () {
    return {
        restrict: "E",
        scope: {
            options: "="
        },
        replace: true,
        templateUrl: "js/templates/url-info.html",
        controller: function ($scope) {

            $scope.ui = {
                snippet: false
            };

            /**
             *
             */
            $scope.toggleSnippet = function () {
                $scope.ui.snippet = !$scope.ui.snippet;
            };
        }
    };
});
},{"../module":7,"../utils":11}],5:[function(require,module,exports){
/**
 * @type {angular}
 */
var app       = require("../module");
var utils     = require("../utils");

/**
 * URL info header
 */
app.directive("urlInfo", function () {
    return {
        restrict: "E",
        scope: {
            options: "="
        },
        replace: true,
        templateUrl: "js/templates/url-info.html",
        controller: function ($scope) {

            var urls = $scope.options.urls;

            $scope.type = $scope.options.server ? "Server" : "Proxy";

            $scope.urls = [];

            $scope.urls.push({
                name: "Local (your machine)",
                url: urls.local
            });

            if (urls.external) {
                $scope.urls.push({
                    name: "External (other devices on your wifi network)",
                    url: urls.external
                });
            }

            if (urls.tunnel) {
                $scope.urls.push({
                    name: "Public URL",
                    url: urls.tunnel
                });
            }
        }
    };
});
},{"../module":7,"../utils":11}],6:[function(require,module,exports){
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
var Directives  = require("./directives");

/* jshint ignore:end */
},{"./controllers":2,"./directives":3,"./modules/notify":8,"./modules/socket":9,"./services":10}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
/**
 *
 * Custom Notify module for Global notifications
 *
 */
angular.module('Notify', [])

    .directive("notifyElem", function () {

        return {
            restrict: "E",
            scope: {
                options: "="
            },
            templateUrl: "js/templates/notify-elem.html",

            controller: function ($scope, $rootScope) {

                /**
                 * Default state
                 * @type {{visible: boolean, status: string, heading: string, text: string}}
                 */
                $scope.ui = {
                    visible: false,
                    status: "success",
                    heading: "BrowserSync:",
                    text: "Dummy message bro"
                };

                /**
                 * @param evt
                 * @param data
                 */
                $scope.show = function (evt, data) {

                    data = data || {};

                    if ($scope._timer) {
                        clearTimeout($scope._timer);
                    }

                    $scope._timer = window.setTimeout($scope.reset, data.timeout || 2000);

                    if (data.message) {

                        $scope.ui.visible = true;
                        $scope.ui.status  = data.status || "info";
                        $scope.ui.text    = data.message;

                        if (data.heading) {
                            $scope.ui.heading  = data.heading;
                        }
                    }
                };

                $scope.reset = function () {
                    $scope.$apply(function () {
                        $scope.ui.visible = false;
                    })
                };

                $rootScope.$on("notify:flash", $scope.show);
            }
        }
    });
},{}],9:[function(require,module,exports){
/**
 * @type {{emit: emit, on: on}}
 */
var socket = window.___browserSync___.socket || {
    emit: function(){},
    on: function(){},
    removeListener: function(){}
};

/**
 *
 * Custom Notify module for Global notifications
 *
 */
angular.module('Socket', [])

    .service("Socket", function () {

        return {
            addEvent: function (name, callback) {
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
},{}],10:[function(require,module,exports){
//require("./socket");
},{}],11:[function(require,module,exports){
module.exports = {
    ucfirst: function (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
};
},{}]},{},[6])