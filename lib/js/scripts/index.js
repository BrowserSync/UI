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