(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/**
 * @type {app|exports}
 */
var app    = require("./module");

/**
 * Main Ctrl
 */

app.controller("MainCtrl", ["$scope", "$rootScope", "$location", "Socket", "$injector", MainCtrl]);


/**
 * @param $$scope
 * @param $rootScope
 * @param $location
 * @param Socket
 * @param $injector
 * @constructor
 */
function MainCtrl ($$scope, $rootScope, $location, Socket, $injector) {

    var $scope      = this;
    $scope.options  = false;
    $scope.browsers = [];
    $scope.socketId = "";

    var contentSections = $injector.get("contentSections");
    var ContentSections = $injector.get("ContentSections");
    var Location        = $injector.get("Location");

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
    $scope.refreshAll = function () {
        Location.refreshAll();
        $rootScope.$emit("notify:flash", {
            heading: "Instruction sent:",
            message: "Reload All Browsers  ✔"
        });
    };

    /**
    * Emit the socket event
    */
    $scope.sendAllTo = function (path) {
        Location.sendAllTo(path);
        $rootScope.$emit("notify:flash", {
            heading: "Instruction sent:",
            message: "Reset all Browsers to /"
        });
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
            $scope.update(options);
        },
        /**
         *
         */
        disconnect: function () {
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
    $rootScope.$on("cp:disconnect", $scope.socketEvents.disconnect);
    $rootScope.$on("cp:connection", function (evt, options) {
        $scope.socketEvents.connection(options);
        $$scope.$digest();
    });
}

/**
 * Options transformations
 * @param options
 * @returns {*}
 */
function transformOptions(options) {

    options.displayUrl = getDisplayUrl(options.urls);

    return options;
}

/**
 * @param urls
 * @returns {*}
 */
function getDisplayUrl (urls) {
    if (!urls) {
        return false;
    }
    return urls.external || urls.local;
}
},{"./module":4}],2:[function(require,module,exports){
"use strict";

/* jshint ignore:start */
var module      = angular.module("BrowserSync", [
    "History",
    "Disconnect",
    "Notify",
    "Socket",
    "ngRoute",
    "ngTouch",
    "ngSanitize"
]);

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
var discon      = require("./modules/disconnect");
var notify      = require("./modules/notify");
var history     = require("./modules/history");
var socket      = require("./modules/socket");
var app         = require("./services/ContentSections");
var options     = require("./services/Options");
var Controllers = require("./MainCtrl");
var Filters     = require("./filters");
/* jshint ignore:end */
},{"./MainCtrl":1,"./filters":3,"./modules/disconnect":5,"./modules/history":6,"./modules/notify":7,"./modules/socket":8,"./services/ContentSections":9,"./services/Options":10}],3:[function(require,module,exports){
var module = require("./module"); //jshint ignore:line

module.filter("ucfirst", function () {
    return function(input) {
        return input.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
    };
});
module.filter("localRootUrl", function () {
    return function(port) {
        return ["//", window.location.hostname, ":", port].join("");
    };
});
module.filter("localUrl", function () {
    return function(path, port) {
        return ["//", window.location.hostname, ":", port, path].join("");
    };
});

module.filter("orderObjectBy", function() {
    return function (items, field, reverse) {
        var filtered = [];
        angular.forEach(items, function(item) {
            filtered.push(item);
        });
        filtered.sort(function (a, b) {
            return (a[field] > b[field] ? 1 : -1);
        });
        if (reverse) {
            filtered.reverse();
        }
        return filtered;
    };
});

module.directive("markable", function () {
    return {
        scope: {},
        restrict: "A",
        link: function () {
            //var click = function (evt) {
            //    elem.toggleClass("active");
            //};
            //elem.on("click", click);
            //scope.$on('$destroy', function () {
            //    elem.off('click', click);
            //});
        }
    };
});
},{"./module":4}],4:[function(require,module,exports){
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
angular.module("Disconnect", [])

    .directive("disconnectElem", function () {

        return {
            restrict: "E",
            scope: {},
            template: '<section bs-Overlay ng-class="{\'active\': ui.visible}"><p><i bs-Icon="block" bs-Icon-Size="jumbo"></i></p><h1 bs-Weight="light">{{ui.heading}} {{ui.message}}</h1><p>Possible reasons are:</p><ul bs-List><li>1. Your process was exited by another tool</li></ul></section>', // jshint:ignore
            controller: ["$scope", "$rootScope", "$window", disconnectController]
        };
    });

/**
 * Disconnect
 * @param $scope
 * @param $rootScope
 */
function disconnectController ($scope, $rootScope, $window) {

    /**
     * Default settings
     */
    const DEFAULT_HEADING = "BrowserSync";
    const DEFAULT_MESSAGE = "Disconnected";

    $scope._disconnected  = false;

    /**
     * Default state
     * @type {{visible: boolean, status: string, heading: string, text: string}}
     */
    $scope.ui = {
        visible: false,
        heading: DEFAULT_HEADING,
        message: DEFAULT_MESSAGE
    };

    /**
     * @type {{connection: Function, disconnect: Function}}
     */
    $scope.socketEvents = {
        connection: function () {
            if ($scope._disconnected) {
                $window.location.reload(true);
            }
            $scope.ui.visible = false;
            $scope.$digest();
        },
        disconnect: function () {
            $scope._disconnected = true;
            $scope.ui.visible = true;
            $scope.$digest();
        }
    };

    $rootScope.$on("cp:connection", $scope.socketEvents.connection);
    $rootScope.$on("cp:disconnect", $scope.socketEvents.disconnect);
}
},{}],6:[function(require,module,exports){
/**
 * Custom Notify module for Global notifications
 */
angular.module('History', ['Socket'])

    .service("Location", ["$q", "$rootScope", "Socket", function ($q, $rootScope, Socket) {

        var visited  = [];

        var api = {
            visited: visited,
            updateHistory: function (urls) {
                visited = urls;
            },
            getHistory: function () {
                return Socket.getData("visited");
            },
            remove: function (data) {
                Socket.emit("cp:remove:visited", data);
            },
            clear: function () {
                Socket.emit("cp:clear:visited");
            },
            refreshAll: function () {
                Socket.emit("urls:browser:reload");
            },
            sendAllTo: function (path) {
                Socket.emit("urls:browser:url", {
                    path: path
                });
            }
        };

        //Socket.on("cp:urls:update", api.updateHistory);

        //console.log(Socket);

        //socket.on("connection", function (out) {
        //    $rootScope.$emit("cp:connection", out);
        //    deferred.resolve(out, this);
        //});

        return api;
    }]);


},{}],7:[function(require,module,exports){
/**
 *
 * Custom Notify module for Global notifications
 *
 */
angular.module('Notify', [])

    .directive("notifyElem", function () {

        return {
            restrict: "E",
            scope: {},
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
},{}],8:[function(require,module,exports){
/**
 * @type {{emit: emit, on: on}}
 */
var socket = window.___browserSync___.socket || {

    emit: function () {},
    on: function () {},
    removeListener: function () {}
};

(function (angular) {

    /**
     * Custom Notify module for Global notifications
     */
    angular.module('Socket', [])

        .service("Socket", ["$q", "$rootScope", function ($q, $rootScope) {

            var deferred = $q.defer();

            socket.on("connection", function (out) {
                $rootScope.$emit("cp:connection", out);
                deferred.resolve(out, this);
            });

            socket.on("disconnect", function () {
                $rootScope.$emit("cp:disconnect");
            });

            return {
                on: function (name, callback) {
                    socket.on(name, callback);
                },
                off: function (name, callback) {
                    socket.off(name, callback);
                },
                removeEvent: function (name, callback) {
                    socket.removeListener(name, callback);
                },
                emit: function (name, data) {
                    socket.emit(name, data || {});
                },
                options: function () {
                    return deferred.promise;
                },
                getData: function (name) {
                    var deferred = $q.defer();
                    socket.on("cp:receive:" + name, function (data) {
                        deferred.resolve(data);
                    });
                    socket.emit("cp:get:" + name);
                    return deferred.promise;
                }
            };
        }]);

})(angular);

},{}],9:[function(require,module,exports){
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
},{"../module":4}],10:[function(require,module,exports){
/**
 * @type {angular}
 */
var app = require("../module");

app.factory("Options", ["Socket", OptionsService]);

/**
 * @param Socket
 * @constructor
 */
function OptionsService(Socket) {

    return {
        all: function () {
            return Socket.getData("options");
        }
    }
}
},{"../module":4}]},{},[2])