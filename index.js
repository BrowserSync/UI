"use strict";

var through   = require("through");
var fs        = require("fs");
var connect   = require("connect");
var ports     = require("portscanner-plus");
var http      = require("http");


/**
 * @param connector
 * @returns {Function}
 */
function getScriptMiddleware(connector) {

    var jsFile    = "/lib/js/dist/app.js";

    return function (req, res, next) {

        res.setHeader("Content-Type", "text/javascript");

        return fs.createReadStream(__dirname + jsFile)
            .pipe(through(function (buffer) {
                this.queue(connector + buffer.toString());
            }))
            .pipe(res);
    };
}

/**
 * @param {object} bs
 * @returns {Function}
 */
function getInfoLogger(bs) {
    return function (msg, vars) {
        bs.events.emit("msg:info", {msg: "Control Panel: " + msg, vars: vars});
    };
}

/**
 * @param {object} bs
 * @returns {Function}
 */
function getDebugLogger(bs) {
    return function (msg, vars) {
        bs.events.emit("msg:debug", {msg: "Control Panel: " + msg, vars: vars});
    };
}

/**
 * @param options
 * @returns {*}
 */
function startServer(options) {

    var app = connect();

    app.use("/js/dist/app.js", getScriptMiddleware(getConnector(options.urls.local)));
    app.use(connect.static(__dirname + "/lib"));

    return http.createServer(app);
}

/**
 * @param url
 * @returns {string}
 */
function getConnector(url) {
    return "var ___socket___ = io.connect('%s');".replace("%s", url);
}

/**
 * @param ports
 */
function start(ports) {

    var bs     = this; // jshint ignore:line
    var port   = ports[0];
    var log    = getInfoLogger(bs);
    var debug  = getDebugLogger(bs);

    debug("Using port %s", port);

    debug("Starting Control panel server...");

    var server = startServer(bs.options);

    server.listen(port);

    log("Running at: http://localhost:" + port);
}

/**
 * Interface required for BrowserSync
 * @returns {Function}
 */
function plugin() {

    /**
     * @param {Object} bs
     */
    return function (bs) {

        ports.getPorts(1).then(start.bind(bs));

        return true;
    };
}

/**
 * Module exports
 */
module.exports.plugin        = plugin;
module.exports.getInfoLogger = getInfoLogger;
module.exports.startServer   = startServer;

