(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (angular) {

    angular
        .module("BrowserSync", [
            "bsHistory",
            "bsClients",
            "bsDisconnect",
            "bsNotify",
            "bsSocket",
            "ngRoute",
            "ngTouch",
            "ngSanitize"
        ])
        .config(["$locationProvider", Config]);

    /**
     * @constructor
     * @param $locationProvider
     */
    function Config ($locationProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }

})(angular);

/**
 * Modules
 * @type {exports}
 */
/* jshint ignore:start */
var discon      = require("./modules/bsDisconnect");
var notify      = require("./modules/bsNotify");
var history     = require("./modules/bsHistory");
var clients     = require("./modules/bsClients");
var socket      = require("./modules/bsSocket");
var app         = require("./services/Pages");
var options     = require("./services/Options");
var mainCtrl    = require("./main/controller");
var filter      = require("./filters");
var directives  = require("./directives");
/* jshint ignore:end */
},{"./directives":2,"./filters":4,"./main/controller":5,"./modules/bsClients":7,"./modules/bsDisconnect":8,"./modules/bsHistory":9,"./modules/bsNotify":10,"./modules/bsSocket":11,"./services/Options":12,"./services/Pages":13}],2:[function(require,module,exports){
var module = require("./module"); //jshint ignore:line

module.directive("icon", require("./directives/icon"));
},{"./directives/icon":3,"./module":6}],3:[function(require,module,exports){
module.exports = function () {
    return {
        scope: {
            icon: "@"
        },
        restrict: "E",
        replace: true,
        template: "<svg bs-svg-icon><use xlink:href=\"{{iconName}}\"></use></svg>",
        link: function (scope, elem, attrs) {
            scope.iconName = "#svg-" + scope.icon;
            return scope;
        }
    };
};
},{}],4:[function(require,module,exports){
var module = require("./module"); //jshint ignore:line
var utils  = require("./utils"); //jshint ignore:line

module
    .filter("ucfirst",       function () { return utils.ucfirst;       })
    .filter("localRootUrl",  function () { return utils.localRootUrl;  })
    .filter("localUrl",      function () { return utils.localRootUrl;  })
    .filter("orderObjectBy", function () { return utils.orderObjectBy; });
},{"./module":6,"./utils":14}],5:[function(require,module,exports){
var app    = require("../module");

app.controller("MainController", [
    "$scope",
    "$rootScope",
    "$location",
    "$injector",
    MainController
]);


/**
 * @param $scope
 * @param $rootScope
 * @param $location
 * @param $injector
 * @constructor
 */
function MainController ($scope, $rootScope, $location, $injector) {

    var ctrl      = this;
    ctrl.options  = false;
    ctrl.browsers = [];
    ctrl.socketId = "";

    var pagesConfig = $injector.get("pagesConfig");
    var Pages       = $injector.get("Pages");
    var Socket      = $injector.get("Socket");
    var Clients     = $injector.get("Clients");

    ctrl.ui = {
        menu:         pagesConfig,
        sectionMenu:  false,
        disconnected: false
    };

    /**
     * @param $section
     */
    ctrl.setActiveSection = function ($section) {
        Pages.enable($section);
        $location.path($section.path);
        ctrl.ui.sectionMenu = false;
    };

    /**
     * Refresh all event
     */
    ctrl.reloadAll = function () {
        Clients.reloadAll();
        $rootScope.$emit("notify:flash", {
            heading: "Instruction sent:",
            message: "Reload All Browsers  ✔"
        });
    };

    /**
     * @param value
     */
    ctrl.scrollAllTo = function () {
        Clients.scrollAllTo(0);
        $rootScope.$emit("notify:flash", {
            heading: "Instruction sent:",
            message: "Scroll all browsers to Y=0  ✔"
        });
    };

    /**
     * Emit the socket event
     */
    ctrl.sendAllTo = function (path) {
        Clients.sendAllTo(path);
        $rootScope.$emit("notify:flash", {
            heading: "Instruction sent:",
            message: "Reset all Browsers to /"
        });
    };

    /**
     *
     */
    ctrl.toggleMenu = function () {
        ctrl.ui.sectionMenu = !ctrl.ui.sectionMenu;
    };

    /**
     * @type {{connection: connection, addBrowsers: addBrowsers}}
     */
    ctrl.socketEvents = {

        /**
         * @param options
         */
        connection: function (options) {
            ctrl.update(options);
        },
        /**
         *
         */
        disconnect: function () {
            ctrl.ui.disconnected = true;
        }
    };

    /**
     * Update the current $scope
     */
    ctrl.update = function (options) {

        ctrl.options = transformOptions(options);
        ctrl.ui.disconnected = false;

        Pages.transform(pagesConfig["overview"], function ($section) {
            return $section;
        });
    };

    /**
     * Set the currently active page
     */
    ctrl.setActiveSection(Pages.current());

    /**
     * Get options from socket connection
     */
    Socket.options().then(ctrl.socketEvents.connection);

    /**
     * React to disconnects
     */
    $rootScope.$on("ui:disconnect", ctrl.socketEvents.disconnect);
    $rootScope.$on("ui:connection", function (evt, options) {
        ctrl.socketEvents.connection(options);
        $scope.$digest();
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
},{"../module":6}],6:[function(require,module,exports){
(function (angular) {

    /**
     * @type {angular}
     */
    module.exports = angular.module("BrowserSync");

})(angular);

},{}],7:[function(require,module,exports){
(function (angular) {

    angular
        .module("bsClients", ["bsSocket"])
        .service("Clients", ["Socket", ClientsService]);

    /**
     * @param Socket
     * @returns {{reloadAll: Function, sendAllTo: Function, scrollAllTo: Function, highlight: Function}}
     * @constructor
     */
    function ClientsService (Socket) {

        var api = {
            reloadAll:   function () {
                Socket.clientEvent("browser:reload");
            },
            sendAllTo:   function (path) {
                Socket.emit("urls:browser:url", {
                    path: path
                });
            },
            scrollAllTo: function () {
                Socket.clientEvent("scroll", {
                    position: {
                        raw:          0,
                        proportional: 0
                    },
                    override: true
                });
            },
            highlight:   function (connection) {
                Socket.emit("ui:highlight", connection);
            }
        };

        return api;
    }

})(angular);


},{}],8:[function(require,module,exports){
(function () {

    angular
        .module("bsDisconnect", [])
        .directive("disconnectElem", function () {
            return {
                restrict: "E",
                scope: {},
                template: '<section bs-overlay ng-class="{\'active\': ui.visible}">\n    <p><icon icon="block"></icon></p>\n    <h1>{{ui.heading}} {{ui.message}}</h1>\n    <p>Possible reasons are:</p>\n    <ul bs-list>\n        <li>1. Your process was exited by another tool</li>\n    </ul>\n    <p>You should check your terminal window to see what happened. <br/>(Or simply try reloading this page.)</p>\n</section>', // jshint:ignore
                controller: ["$scope", "$rootScope", "$window", disconnectController]
            };
        });

    /**
     * Disconnect
     * @param $scope
     * @param $rootScope
     * @param $window
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

        $rootScope.$on("ui:connection", $scope.socketEvents.connection);
        $rootScope.$on("ui:disconnect", $scope.socketEvents.disconnect);
    }

})(angular);


},{}],9:[function(require,module,exports){
(function (angular) {

    angular
        .module("bsHistory", ["bsSocket"])
        .service("History", ["Socket", HistoryService]);

    function HistoryService (Socket) {

        var visited     = [];
        var updateStack = [];

        /**
         * Add a single socket event and call all callbacks listening to it.
         */
        Socket.on("ui:history:update", function (items) {
            updateStack.forEach(function (fn) {
                fn(items);
            });
        });

        return {
            visited: visited,
            updateHistory: function (urls) {
                visited = urls;
            },
            get: function () {
                return Socket.getData("visited");
            },
            remove: function (data) {
                Socket.emit("ui:history:remove", data);
            },
            clear: function () {
                Socket.emit("ui:history:clear");
            },
            on: function (event, fn) {
                updateStack.push(fn);
            },
            off: function (fn) {
                var index = updateStack.indexOf(fn);
                if (index > -1) {
                    updateStack = updateStack.splice(index, 1);
                }
            }
        };
    }

})(angular);


},{}],10:[function(require,module,exports){
(function (angular) {

    angular
        .module('bsNotify', [])
        .directive("notifyElem", function () {
            return {
                restrict: "E",
                scope: {},
                template: "<div bs-notify ng-class=\"{\'active\': ui.visible}\">\n    <p class=\"notification__text\">{{ui.heading}} <span class=\"color--lime\">{{ui.message}}</span></p>\n</div>",
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
})(angular);
},{}],11:[function(require,module,exports){
(function (angular, browserSyncSocket) {

    /**
     * @type {{emit: emit, on: on}}
     */
    var socket = browserSyncSocket || {

        emit: function () {},
        on: function () {},
        removeListener: function () {}
    };

    angular
        .module("bsSocket", [])
        .service("Socket", ["$q", "$rootScope", SocketService]);

    function SocketService ($q, $rootScope) {

        var deferred = $q.defer();

        socket.on("connection", function (out) {
            $rootScope.$emit("ui:connection", out);
            deferred.resolve(out, this);
        });

        socket.on("disconnect", function () {
            $rootScope.$emit("ui:disconnect");
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
            /**
             * Proxy client events
             * @param name
             * @param data
             */
            clientEvent: function (name, data) {
                socket.emit("ui:client:proxy", {
                    event: name,
                    data: data
                });
            },
            options: function () {
                return deferred.promise;
            },
            getData: function (name) {
                var deferred = $q.defer();
                socket.on("ui:receive:" + name, function (data) {
                    deferred.resolve(data);
                });
                socket.emit("ui:get:" + name);
                return deferred.promise;
            }
        };
    }

})(angular, window.___browserSync___.socket);

},{}],12:[function(require,module,exports){
var app = require("../module");

app.factory("Options", ["Socket", OptionsService]);

/**
 * @param Socket
 * @returns {{all: Function}}
 * @constructor
 */
function OptionsService(Socket) {

    return {
        all: function () {
            return Socket.getData("options");
        }
    };
}
},{"../module":6}],13:[function(require,module,exports){
/**
 * @type {angular}
 */
var app = require("../module");

app.service("Pages", ["pagesConfig", "$location", ContentSections]);

/**
 * @param pagesConfig
 * @param $location
 * @returns {{enable: Function, transform: Function, current: Function}}
 * @constructor
 */
function ContentSections(pagesConfig, $location) {

    return {
        /**
         * Enable a single Item
         * @param $section
         * @returns {*}
         */
        enable: function ($section) {
            angular.forEach(pagesConfig, function (item) {
                item.active = false;
            });
            $section.active = true;
            return pagesConfig;
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
                return pagesConfig["overview"];
            }
            var match;
            angular.forEach(pagesConfig, function (item) {
                if (item.path === $location.path()) {
                    match = item;
                }
            });
            return match;
        }
    };
}
},{"../module":6}],14:[function(require,module,exports){
module.exports = {
    ucfirst: function (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },
    localRootUrl: function (port, scheme) {
        return [scheme, "://", window.location.hostname, ":", port].join("");
    },
    localUrl: function(path, port, mode) {
        if (mode === "snippet") {
            return path;
        }
        return ["//", window.location.hostname, ":", port, path].join("");
    },
    orderObjectBy: function (items, field, reverse) {
        var filtered = [];
        Object.keys(items).forEach(function(key) {
            filtered.push(items[key]);
        });
        filtered.sort(function (a, b) {
            return (a[field] > b[field] ? 1 : -1);
        });
        if (reverse) {
            filtered.reverse();
        }
        return filtered;
    }
};
},{}]},{},[1]);
