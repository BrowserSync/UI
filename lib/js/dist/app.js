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
},{"./module":8,"./socket":9}],2:[function(require,module,exports){
"use strict";

var socket = require("../socket");

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

    /**
     * @param url
     */
    $scope.goTo = function (url) {
        socket.emit("cp:goTo", {url: url});
    };

    Socket.addEvent("connection", $scope.socketEvents.connection);
//    Socket.addEvent("cp:browser:update", $scope.socketEvents.addBrowsers);
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
},{"../module":8,"../socket":9}],3:[function(require,module,exports){
/**
 * @type {angular}
 */
var app       = require("../module");
var utils     = require("../utils");
var socket    = require("../socket");
var multiline = require("multiline");

var template = multiline(function(){/*
 <ul class="nav">
    <li ng-repeat="(key, value) in items">
        <input type="checkbox" ng-model="value" ng-click="toggle(key, value)"> {{key}} ({{value}})
    </li>
    <li><br></li>
    <li><b>Forms:</b></li>
     <li ng-repeat="item in formItems">
        <input type="checkbox" ng-model="item.value" ng-click="formToggle(item)"> {{item.name}} ({{item.value}})
     </li>
 </ul>
 */});

/**
 * Option list
 */
app.directive("optionList", function () {
    return {
        restrict: "E",
        scope: {
            options: "="
        },
        template: template,
        link: function ($scope) {

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
                socket.emit("cp:option:set", {key: prefixOption(key), value: newValue});
            }

            /**
             * Toggle Options
             * @param key
             * @param value
             */
            $scope.formToggle = function (item) {
                var newValue = !item.value;
                socket.emit("cp:option:set", {key: prefixOption(item.key), value: newValue});
            }

            function prefixOption(key) {
                return "ghostMode." + key;
            }
        }
    };
});

},{"../module":8,"../socket":9,"../utils":10,"multiline":11}],4:[function(require,module,exports){
/**
 * @type {angular}
 */
var app       = require("../module");
var utils     = require("../utils");
var multiline = require("multiline");

var template = multiline(function(){/*
<div>
    <a href="" title="Show Snippet" ng-click="toggleSnippet()">Show Snippet</a>
     <div ng-show="ui.snippet">
         <p>Place this snippet somewhere before the closing <code>&lt;/body&gt;</code> tag in your website</p>
         <div class="highlight small text--left">
            <pre><code>{{options.snippet}}</code></pre>
         </div>
         <button ng-click="toggleSnippet()">Close</button>
     </div>
</div>
*/});

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
        template: template,
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
},{"../module":8,"../utils":10,"multiline":11}],5:[function(require,module,exports){
/**
 * @type {angular}
 */
var app       = require("../module");
var utils     = require("../utils");
var multiline = require("multiline");

var template = multiline(function(){/*
<div>
    <ul class="nav url-nav">
        <li ng-repeat="url in urls"><span>{{url.name}}</span>: <a href="{{url.url}}" target="_blank">{{url.url}}</a></li>
    </ul>
</div>
*/});

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
        template: template,
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
},{"../module":8,"../utils":10,"multiline":11}],6:[function(require,module,exports){
/**
 * @type {angular}
 */
var app       = require("../module");
var utils     = require("../utils");
var multiline = require("multiline");

var template = multiline(function(){/*
<div>
    <input type="text" ng-model="urls.current">
</div>
*/});

/**
 * URL info header
 */
app.directive("urlSync", function () {
    return {
        restrict: "E",
        scope: {
            options: "="
        },
        replace: true,
        template: template,
        controller: function ($scope) {
            $scope.urls = {
                current: ""
            }
        }
    };
});
},{"../module":8,"../utils":10,"multiline":11}],7:[function(require,module,exports){
"use strict";

/* jshint ignore:start */
var module      = angular.module("BrowserSync", []);

var app         = require("./app");
var MainCtrl    = require("./controllers/MainCtrl");
var UrlInfo     = require("./directives/url-info");
var UrlInfo     = require("./directives/snippet-info");
var OptionList  = require("./directives/option-list");
var urlSync     = require("./directives/url-sync");

/* jshint ignore:end */
},{"./app":1,"./controllers/MainCtrl":2,"./directives/option-list":3,"./directives/snippet-info":4,"./directives/url-info":5,"./directives/url-sync":6}],8:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
module.exports = {
    ucfirst: function (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
};
},{}],11:[function(require,module,exports){
'use strict';
var stripIndent = require('strip-indent');

// start matching after: comment start block => ! or @preserve => optional whitespace => newline
// stop matching before: last newline => optional whitespace => comment end block
var reCommentContents = /\/\*!?(?:\@preserve)?[ \t]*(?:\r\n|\n)([\s\S]*?)(?:\r\n|\n)\s*\*\//;

var multiline = module.exports = function (fn) {
	if (typeof fn !== 'function') {
		throw new TypeError('Expected a function.');
	}

	var match = reCommentContents.exec(fn.toString());

	if (!match) {
		throw new TypeError('Multiline comment missing.');
	}

	return match[1];
};

multiline.stripIndent = function (fn) {
	return stripIndent(multiline(fn));
};

},{"strip-indent":12}],12:[function(require,module,exports){
'use strict';
module.exports = function (str) {
	var match = str.match(/^[ \t]*(?=\S)/gm);

	if (!match) {
		return str;
	}

	var indent = Math.min.apply(Math, match.map(function (el) {
		return el.length;
	}));

	var re = new RegExp('^[ \\t]{' + indent + '}', 'gm');

	return indent > 0 ? str.replace(re, '') : str;
};

},{}]},{},[7])