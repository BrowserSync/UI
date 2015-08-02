(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var angular = window.angular;

angular
    .module("BrowserSync", [
        "bsHistory",
        "bsClients",
        "bsDisconnect",
        "bsNotify",
        "bsSocket",
        "bsStore",
        "ngRoute",
        "ngTouch",
        "ngSanitize"
    ])
    .config(["$locationProvider", Config]);

/**
 * @constructor
 * @param $locationProvider
 */
function Config($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}


/**
 * Modules
 * @type {exports}
 */
/* jshint ignore:start */
var discon = require("./modules/bsDisconnect");
var notify = require("./modules/bsNotify");
var history = require("./modules/bsHistory");
var clients = require("./modules/bsClients");
var socket = require("./modules/bsSocket");
var app = require("./services/Pages");
var options = require("./services/Options");
var Store = require("./modules/bsStore");
var mainCtrl = require("./main/controller");
var filter = require("./filters");
var directives = require("./directives");
/* jshint ignore:end */
},{"./directives":5,"./filters":10,"./main/controller":11,"./modules/bsClients":13,"./modules/bsDisconnect":14,"./modules/bsHistory":15,"./modules/bsNotify":16,"./modules/bsSocket":17,"./modules/bsStore":18,"./services/Options":19,"./services/Pages":20}],2:[function(require,module,exports){
(function (root, factory){
  'use strict';

  /*istanbul ignore next:cant test*/
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else {
    // Browser globals
    root.objectPath = factory();
  }
})(this, function(){
  'use strict';

  var
    toStr = Object.prototype.toString,
    _hasOwnProperty = Object.prototype.hasOwnProperty;

  function isEmpty(value){
    if (!value) {
      return true;
    }
    if (isArray(value) && value.length === 0) {
        return true;
    } else if (!isString(value)) {
        for (var i in value) {
            if (_hasOwnProperty.call(value, i)) {
                return false;
            }
        }
        return true;
    }
    return false;
  }

  function toString(type){
    return toStr.call(type);
  }

  function isNumber(value){
    return typeof value === 'number' || toString(value) === "[object Number]";
  }

  function isString(obj){
    return typeof obj === 'string' || toString(obj) === "[object String]";
  }

  function isObject(obj){
    return typeof obj === 'object' && toString(obj) === "[object Object]";
  }

  function isArray(obj){
    return typeof obj === 'object' && typeof obj.length === 'number' && toString(obj) === '[object Array]';
  }

  function isBoolean(obj){
    return typeof obj === 'boolean' || toString(obj) === '[object Boolean]';
  }

  function getKey(key){
    var intKey = parseInt(key);
    if (intKey.toString() === key) {
      return intKey;
    }
    return key;
  }

  function set(obj, path, value, doNotReplace){
    if (isNumber(path)) {
      path = [path];
    }
    if (isEmpty(path)) {
      return obj;
    }
    if (isString(path)) {
      return set(obj, path.split('.').map(getKey), value, doNotReplace);
    }
    var currentPath = path[0];

    if (path.length === 1) {
      var oldVal = obj[currentPath];
      if (oldVal === void 0 || !doNotReplace) {
        obj[currentPath] = value;
      }
      return oldVal;
    }

    if (obj[currentPath] === void 0) {
      //check if we assume an array
      if(isNumber(path[1])) {
        obj[currentPath] = [];
      } else {
        obj[currentPath] = {};
      }
    }

    return set(obj[currentPath], path.slice(1), value, doNotReplace);
  }

  function del(obj, path) {
    if (isNumber(path)) {
      path = [path];
    }

    if (isEmpty(obj)) {
      return void 0;
    }

    if (isEmpty(path)) {
      return obj;
    }
    if(isString(path)) {
      return del(obj, path.split('.'));
    }

    var currentPath = getKey(path[0]);
    var oldVal = obj[currentPath];

    if(path.length === 1) {
      if (oldVal !== void 0) {
        if (isArray(obj)) {
          obj.splice(currentPath, 1);
        } else {
          delete obj[currentPath];
        }
      }
    } else {
      if (obj[currentPath] !== void 0) {
        return del(obj[currentPath], path.slice(1));
      }
    }

    return obj;
  }

  var objectPath = function(obj) {
    return Object.keys(objectPath).reduce(function(proxy, prop) {
      if (typeof objectPath[prop] === 'function') {
        proxy[prop] = objectPath[prop].bind(objectPath, obj);
      }

      return proxy;
    }, {});
  };

  objectPath.has = function (obj, path) {
    if (isEmpty(obj)) {
      return false;
    }

    if (isNumber(path)) {
      path = [path];
    } else if (isString(path)) {
      path = path.split('.');
    }

    if (isEmpty(path) || path.length === 0) {
      return false;
    }

    for (var i = 0; i < path.length; i++) {
      var j = path[i];
      if ((isObject(obj) || isArray(obj)) && _hasOwnProperty.call(obj, j)) {
        obj = obj[j];
      } else {
        return false;
      }
    }

    return true;
  };

  objectPath.ensureExists = function (obj, path, value){
    return set(obj, path, value, true);
  };

  objectPath.set = function (obj, path, value, doNotReplace){
    return set(obj, path, value, doNotReplace);
  };

  objectPath.insert = function (obj, path, value, at){
    var arr = objectPath.get(obj, path);
    at = ~~at;
    if (!isArray(arr)) {
      arr = [];
      objectPath.set(obj, path, arr);
    }
    arr.splice(at, 0, value);
  };

  objectPath.empty = function(obj, path) {
    if (isEmpty(path)) {
      return obj;
    }
    if (isEmpty(obj)) {
      return void 0;
    }

    var value, i;
    if (!(value = objectPath.get(obj, path))) {
      return obj;
    }

    if (isString(value)) {
      return objectPath.set(obj, path, '');
    } else if (isBoolean(value)) {
      return objectPath.set(obj, path, false);
    } else if (isNumber(value)) {
      return objectPath.set(obj, path, 0);
    } else if (isArray(value)) {
      value.length = 0;
    } else if (isObject(value)) {
      for (i in value) {
        if (_hasOwnProperty.call(value, i)) {
          delete value[i];
        }
      }
    } else {
      return objectPath.set(obj, path, null);
    }
  };

  objectPath.push = function (obj, path /*, values */){
    var arr = objectPath.get(obj, path);
    if (!isArray(arr)) {
      arr = [];
      objectPath.set(obj, path, arr);
    }

    arr.push.apply(arr, Array.prototype.slice.call(arguments, 2));
  };

  objectPath.coalesce = function (obj, paths, defaultValue) {
    var value;

    for (var i = 0, len = paths.length; i < len; i++) {
      if ((value = objectPath.get(obj, paths[i])) !== void 0) {
        return value;
      }
    }

    return defaultValue;
  };

  objectPath.get = function (obj, path, defaultValue){
    if (isNumber(path)) {
      path = [path];
    }
    if (isEmpty(path)) {
      return obj;
    }
    if (isEmpty(obj)) {
      return defaultValue;
    }
    if (isString(path)) {
      return objectPath.get(obj, path.split('.'), defaultValue);
    }

    var currentPath = getKey(path[0]);

    if (path.length === 1) {
      if (obj[currentPath] === void 0) {
        return defaultValue;
      }
      return obj[currentPath];
    }

    return objectPath.get(obj[currentPath], path.slice(1), defaultValue);
  };

  objectPath.del = function(obj, path) {
    return del(obj, path);
  };

  return objectPath;
});

},{}],3:[function(require,module,exports){
;(function(win){
	var store = {},
		doc = win.document,
		localStorageName = 'localStorage',
		scriptTag = 'script',
		storage

	store.disabled = false
	store.version = '1.3.17'
	store.set = function(key, value) {}
	store.get = function(key, defaultVal) {}
	store.has = function(key) { return store.get(key) !== undefined }
	store.remove = function(key) {}
	store.clear = function() {}
	store.transact = function(key, defaultVal, transactionFn) {
		if (transactionFn == null) {
			transactionFn = defaultVal
			defaultVal = null
		}
		if (defaultVal == null) {
			defaultVal = {}
		}
		var val = store.get(key, defaultVal)
		transactionFn(val)
		store.set(key, val)
	}
	store.getAll = function() {}
	store.forEach = function() {}

	store.serialize = function(value) {
		return JSON.stringify(value)
	}
	store.deserialize = function(value) {
		if (typeof value != 'string') { return undefined }
		try { return JSON.parse(value) }
		catch(e) { return value || undefined }
	}

	// Functions to encapsulate questionable FireFox 3.6.13 behavior
	// when about.config::dom.storage.enabled === false
	// See https://github.com/marcuswestin/store.js/issues#issue/13
	function isLocalStorageNameSupported() {
		try { return (localStorageName in win && win[localStorageName]) }
		catch(err) { return false }
	}

	if (isLocalStorageNameSupported()) {
		storage = win[localStorageName]
		store.set = function(key, val) {
			if (val === undefined) { return store.remove(key) }
			storage.setItem(key, store.serialize(val))
			return val
		}
		store.get = function(key, defaultVal) {
			var val = store.deserialize(storage.getItem(key))
			return (val === undefined ? defaultVal : val)
		}
		store.remove = function(key) { storage.removeItem(key) }
		store.clear = function() { storage.clear() }
		store.getAll = function() {
			var ret = {}
			store.forEach(function(key, val) {
				ret[key] = val
			})
			return ret
		}
		store.forEach = function(callback) {
			for (var i=0; i<storage.length; i++) {
				var key = storage.key(i)
				callback(key, store.get(key))
			}
		}
	} else if (doc.documentElement.addBehavior) {
		var storageOwner,
			storageContainer
		// Since #userData storage applies only to specific paths, we need to
		// somehow link our data to a specific path.  We choose /favicon.ico
		// as a pretty safe option, since all browsers already make a request to
		// this URL anyway and being a 404 will not hurt us here.  We wrap an
		// iframe pointing to the favicon in an ActiveXObject(htmlfile) object
		// (see: http://msdn.microsoft.com/en-us/library/aa752574(v=VS.85).aspx)
		// since the iframe access rules appear to allow direct access and
		// manipulation of the document element, even for a 404 page.  This
		// document can be used instead of the current document (which would
		// have been limited to the current path) to perform #userData storage.
		try {
			storageContainer = new ActiveXObject('htmlfile')
			storageContainer.open()
			storageContainer.write('<'+scriptTag+'>document.w=window</'+scriptTag+'><iframe src="/favicon.ico"></iframe>')
			storageContainer.close()
			storageOwner = storageContainer.w.frames[0].document
			storage = storageOwner.createElement('div')
		} catch(e) {
			// somehow ActiveXObject instantiation failed (perhaps some special
			// security settings or otherwse), fall back to per-path storage
			storage = doc.createElement('div')
			storageOwner = doc.body
		}
		var withIEStorage = function(storeFunction) {
			return function() {
				var args = Array.prototype.slice.call(arguments, 0)
				args.unshift(storage)
				// See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
				// and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
				storageOwner.appendChild(storage)
				storage.addBehavior('#default#userData')
				storage.load(localStorageName)
				var result = storeFunction.apply(store, args)
				storageOwner.removeChild(storage)
				return result
			}
		}

		// In IE7, keys cannot start with a digit or contain certain chars.
		// See https://github.com/marcuswestin/store.js/issues/40
		// See https://github.com/marcuswestin/store.js/issues/83
		var forbiddenCharsRegex = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g")
		function ieKeyFix(key) {
			return key.replace(/^d/, '___$&').replace(forbiddenCharsRegex, '___')
		}
		store.set = withIEStorage(function(storage, key, val) {
			key = ieKeyFix(key)
			if (val === undefined) { return store.remove(key) }
			storage.setAttribute(key, store.serialize(val))
			storage.save(localStorageName)
			return val
		})
		store.get = withIEStorage(function(storage, key, defaultVal) {
			key = ieKeyFix(key)
			var val = store.deserialize(storage.getAttribute(key))
			return (val === undefined ? defaultVal : val)
		})
		store.remove = withIEStorage(function(storage, key) {
			key = ieKeyFix(key)
			storage.removeAttribute(key)
			storage.save(localStorageName)
		})
		store.clear = withIEStorage(function(storage) {
			var attributes = storage.XMLDocument.documentElement.attributes
			storage.load(localStorageName)
			for (var i=0, attr; attr=attributes[i]; i++) {
				storage.removeAttribute(attr.name)
			}
			storage.save(localStorageName)
		})
		store.getAll = function(storage) {
			var ret = {}
			store.forEach(function(key, val) {
				ret[key] = val
			})
			return ret
		}
		store.forEach = withIEStorage(function(storage, callback) {
			var attributes = storage.XMLDocument.documentElement.attributes
			for (var i=0, attr; attr=attributes[i]; ++i) {
				callback(attr.name, store.deserialize(storage.getAttribute(attr.name)))
			}
		})
	}

	try {
		var testKey = '__storejs__'
		store.set(testKey, testKey)
		if (store.get(testKey) != testKey) { store.disabled = true }
		store.remove(testKey)
	} catch(e) {
		store.disabled = true
	}
	store.enabled = !store.disabled

	if (typeof module != 'undefined' && module.exports && this.module !== module) { module.exports = store }
	else if (typeof define === 'function' && define.amd) { define(store) }
	else { win.store = store }

})(Function('return this')());

},{}],4:[function(require,module,exports){
/**
 * @type {angular}
 */
module.exports = window.angular;

},{}],5:[function(require,module,exports){
var module = require("./module"); //jshint ignore:line

module.directive("icon", require("./directives/icon"));
module.directive("linkTo", require("./directives/link-to"));
module.directive("switch", require("./directives/switch"));
module.directive("newTab", require("./directives/new-tab"));
},{"./directives/icon":6,"./directives/link-to":7,"./directives/new-tab":8,"./directives/switch":9,"./module":12}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
module.exports = function () {
    return {
        restrict:   "E",
        replace:    false,
        transclude: true,
        scope:      {
            "path": "@"
        },
        template:   "<a href='#' ng-click='navi(path)' ng-transclude=''>as</a>",
        controller: ["$scope", "$location", "$injector", function ($scope, $location, $injector) {

            var pages = $injector.get("pagesConfig");
            var Pages = $injector.get("Pages");

            $scope.navi = function (path) {
                var item = pages[path];
                Pages.enable(item);
                $location.path(path);
            };
        }]
    };
};
},{}],8:[function(require,module,exports){
module.exports = function () {
    return {
        scope: {
            url: "@",
            mode: "@"
        },
        restrict: "E",
        replace: true,
        template: '<a href="{{url}}" bs-button="subtle-alt icon" target="_blank" title="Open a new tab" ng-show="mode !== \'snippet\'"><icon icon="newtab"></icon> New Tab </a>' //jshint:ignore
    };
};
},{}],9:[function(require,module,exports){
module.exports = function () {
    return {
        scope: {
            toggle: "&",
            item: "=",
            switchid: "@",
            title: "@",
            tagline: "@",
            active: "=",
            prop: "@"
        },
        restrict: "E",
        replace: true,
        transclude: true,
        templateUrl: "bs-switch.html",
        controllerAs: "ctrl",
        controller: ["$scope", function ($scope) {
            var ctrl = this;
            ctrl.item = $scope.item;
        }]
    };
};
},{}],10:[function(require,module,exports){
var module = require("./module"); //jshint ignore:line
var utils  = require("./utils"); //jshint ignore:line

module
    .filter("ucfirst",       function () { return utils.ucfirst;       })
    .filter("localRootUrl",  function () { return utils.localRootUrl;  })
    .filter("localUrl",      function () { return utils.localRootUrl;  })
    .filter("orderObjectBy", function () { return utils.orderObjectBy; });
},{"./module":12,"./utils":21}],11:[function(require,module,exports){
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
},{"../module":12}],12:[function(require,module,exports){
/**
 * @type {angular}
 */
module.exports = window.angular.module("BrowserSync");

},{}],13:[function(require,module,exports){
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
                Socket.emit("ui", {
                    namespace: "history",
                    event: "sendAllTo",
                    data: {
                        path: path
                    }
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


},{}],14:[function(require,module,exports){
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


},{}],15:[function(require,module,exports){
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
                Socket.emit("ui", {
                    namespace: "history",
                    event: "remove",
                    data: data
                });
            },
            clear: function () {
                Socket.emit("ui", {
                    namespace: "history",
                    event: "clear"
                });
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


},{}],16:[function(require,module,exports){
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
},{}],17:[function(require,module,exports){
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

        var deferred  = $q.defer();
        var session;

        socket.on("connection", function (out) {
            session = out.session;
            $rootScope.$emit("ui:connection", out);

            deferred.resolve(out, this);

            if (window.name === '') {
                window.name = JSON.stringify({id: socket.id});
            } else {
                var prev = JSON.parse(window.name);
                //console.log(prev, socket);
                if (prev.id !== socket.id) {
                    //console.log('new session');
                } else {
                    //console.log('page reload');
                }
                //console.log(JSON.parse(window.name));
            }
        });

        socket.on("disconnect", function () {
            $rootScope.$emit("ui:disconnect");
        });

        var publicApi = {
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
            },
            uiEvent: function (evt) {
                socket.emit("ui", evt);
            },
            newSession: function () {

            }
        };

        Object.defineProperty(publicApi, 'sessionId', {
            get: function () {
                return session
            }
        });

        return publicApi;
    }

})(angular, window.___browserSync___.socket);

},{}],18:[function(require,module,exports){
var angular     = require('../angular');
var store      = require('store');
var objectPath = require('object-path');

angular
    .module("bsStore", [])
    .service("Store", ["$q", "$rootScope", StoreModule]);

function Store (ns) {
    var bs = store.get('bs', {});
    if (!Object.keys(bs).length) {
        store.set('bs', {});
    }
    this.ns = ns;
    this.get = function (path) {
        var bs = store.get('bs', {});
        if (!Object.keys(bs).length) {
            store.set('bs', {});
        }
        return objectPath.get(bs, [ns].concat(path).join('.'));
    };
    this.set = function (path, value) {
        var bs = store.get('bs', {});
        if (!Object.keys(bs).length) {
            store.set('bs', {});
        }
        if (!bs[ns]) {
            bs[ns] = {};
        }
        bs[ns][path] = value;
        store.set('bs', bs);
    },
    this.remove = function (path) {
        var bs = store.get('bs', {});
        if (!Object.keys(bs).length) {
            store.set('bs', {});
        }
        if (!bs[ns]) {
            bs[ns] = {};
        }
        if (bs[ns][path]) {
            delete bs[ns][path];
        }
        store.set('bs', bs);
    }
}

function StoreModule () {

    return {
        create: function (ns) {
            var store = new Store(ns);
            return store;
        }
    }
};


},{"../angular":4,"object-path":2,"store":3}],19:[function(require,module,exports){
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
},{"../module":12}],20:[function(require,module,exports){
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
},{"../module":12}],21:[function(require,module,exports){
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
