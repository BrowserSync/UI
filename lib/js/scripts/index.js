"use strict";

/* jshint ignore:start */
var module      = angular.module("BrowserSync", ["Notify", "Socket", "ngOrderObjectBy", "ngRoute"]);

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
var notify      = require("./modules/notify");
var socket      = require("./modules/socket");

var app         = require("./services/ContentSections");
var Controllers = require("./MainCtrl");
/* jshint ignore:end */