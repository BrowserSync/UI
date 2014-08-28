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
        },
        emit: function (name, data) {
            socket.emit(name, data || {});
        }
    };
});
},{"./module":8,"./socket":10}],2:[function(require,module,exports){
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
},{"../module":8}],3:[function(require,module,exports){
/**
 * @type {angular}
 */
var app       = require("../module");

/**
 * Option list
 */
app.directive("optionList", function () {
    return {
        restrict: "E",
        scope: {
            options: "="
        },
        templateUrl: "js/templates/option-list.html",
        link: function ($scope, Socket) {

            var ghostMode = $scope.options.ghostMode;

            $scope.items     = {};
            $scope.formItems = [];

            for (var item in ghostMode) {
                if (item !== "forms") {
                    $scope.items[item] = ghostMode[item];
                }
            }

            for (item in ghostMode.forms) {
                $scope.formItems.push({
                    name: item,
                    key: "forms."+item,
                    value: ghostMode.forms[item]
                })
            }

            /**
             * Toggle Options
             * @param key
             * @param value
             */
            $scope.toggle = function (key, value) {
                var newValue = !value;
                Socket.emit("cp:option:set", {key: prefixOption(key), value: newValue});
            };

            /**
             * Toggle Options
             * @param key
             * @param value
             */
            $scope.formToggle = function (item) {
                var newValue = !item.value;
                Socket.emit("cp:option:set", {key: prefixOption(item.key), value: newValue});
            };

            function prefixOption(key) {
                return "ghostMode." + key;
            }
        }
    };
});

},{"../module":8}],4:[function(require,module,exports){
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
},{"../module":8,"../utils":11}],5:[function(require,module,exports){
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
},{"../module":8,"../utils":11}],6:[function(require,module,exports){
/**
 * @type {angular}
 */
var app       = require("../module");

/**
 * URL info header
 */
app.directive("urlSync", function () {
    return {
        restrict: "E",
        scope: {
            options: "="
        },
        templateUrl: "js/templates/url-sync.html",
        controller: function ($scope, $rootScope, Socket) {

            /**
             * @type {{loading: boolean}}
             */
            $scope.ui = {
                loading: false
            };

            /**
             * @type {{local: *, current: string}}
             */
            $scope.urls = {
                local: $scope.options.urls.local,
                current: ""
            };

            /**
             * Emit the reload-all event
             */
            $scope.reloadAll = function () {

                $scope.ui.loading = true;

                Socket.emit("cp:browser:reload");

                window.setTimeout(notify, 500);
            };

            /**
             * Let the user know shit is happening
             */
            function notify() {
                $scope.$apply(function () {
                    $scope.ui.loading = false;
                    $rootScope.$broadcast("notify:flash", {
                        heading: "Instruction Sent:",
                        message: "Reload all browsers..",
                        status: "error",
                        timeout: 2000
                    });
                });
            }
        }
    };
});
},{"../module":8}],7:[function(require,module,exports){
"use strict";

/* jshint ignore:start */
var module      = angular.module("BrowserSync", ["Notify"]);

/**
 * Modules
 * @type {exports}
 */
var notify      = require("./modules/notify");

var app         = require("./app");
var MainCtrl    = require("./controllers/MainCtrl");
var UrlInfo     = require("./directives/url-info");
var UrlInfo     = require("./directives/snippet-info");
var OptionList  = require("./directives/option-list");
var urlSync     = require("./directives/url-sync");

/* jshint ignore:end */
},{"./app":1,"./controllers/MainCtrl":2,"./directives/option-list":3,"./directives/snippet-info":4,"./directives/url-info":5,"./directives/url-sync":6,"./modules/notify":9}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
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
},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
module.exports = {
    ucfirst: function (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
};
},{}]},{},[7])