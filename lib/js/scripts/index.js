"use strict";

/* jshint ignore:start */
var module      = angular.module("BrowserSync", ["Notify"]);

/**
 * Modules
 * @type {exports}
 */
var notify      = require("./modules/notify");


var app         = require("./services");
var Controllers = require("./controllers");
var Directives  = require("./directives");

/* jshint ignore:end */