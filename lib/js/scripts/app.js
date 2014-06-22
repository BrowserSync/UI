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
