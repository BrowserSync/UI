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