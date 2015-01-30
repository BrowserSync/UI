"use strict";

var UI          = require("./lib/UI");
var config      = require("./lib/config");
var Events      = require("events").EventEmitter;

/**
 * These hooks are for attaching functionality to BrowserSync
 */
module.exports.hooks = {
    /**
     * Client JS is added to each connected client
     */
    "client:js": require("fs").readFileSync(__dirname + config.defaults.clientJs)
};

/**
 * BrowserSync Plugin interface
 * @param {Object} opts
 * @param {BrowserSync} bs
 * @param {Function} cb
 * @returns {UI}
 */
module.exports["plugin"] = function (opts, bs, cb) {
    var ui = new UI(opts, bs, new Events());
    ui.cb = cb || function () { /*noop*/ };
    ui.init();
    return ui;
};

module.exports["plugin:name"]       = config.defaults.pluginName;