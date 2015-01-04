"use strict";

/* jshint ignore:start */
var module      = angular.module("BrowserSync", [
    "History",
    "Disconnect",
    "Notify",
    "Socket",
    "ngOrderObjectBy",
    "ngRoute",
    "ngTouch"
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