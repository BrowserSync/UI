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