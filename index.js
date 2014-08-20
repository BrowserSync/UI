"use strict";

var through   = require("through");
var fs        = require("fs");
var connect   = require("connect");
var ports     = require("portscanner-plus");
var http      = require("http");
var tfunk     = require("tfunk");

var PLUGIN_NAME = "Control Panel";

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
 * @param options
 * @returns {*}
 */
function startServer(options) {

    var app = connect();

    app.use("/js/dist/app.js",      getScriptMiddleware(getConnector(options.urls.local)));
    app.use("/js/vendor/socket.js", function (req, res, next) {
        res.setHeader("Content-Type", "text/javascript");
        res.end(options.socketJs);
        next();
    });
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
function start(opts, ports) {

    var bs     = this; // jshint ignore:line
    var port   = ports[0];

    var log = bs.getLogger(PLUGIN_NAME);

    log("debug", "Using port " + port);

    log("debug", "Starting Control panel server...");

    log("debug", "Wait for BrowserSync to complete setup...");

        var server = startServer(bs.options);

        server.listen(port);

        log("info", tfunk("Running at: %Ccyan:http://localhost:" + port));
}

/**
 * Interface required for BrowserSync
 * @returns {Function}
 */
function plugin(bs, opts) {
    ports.getPorts(1).then(start.bind(bs, opts));
}

/**
 * @returns {*}
 */
function clientScript() {
    return fs.readFileSync(__dirname + "/lib/js/includes/events.js");
}

/**
 * @returns {string[]}
 */
function clientEvents() {
    return ["cp:goTo", "cp:log", "options:set"];
}

function serverMiddleware () {
    return [function (req, res, next) {
        console.log("middelware1" + req.url);
        next();
    },function (req, res, next) {
        console.log("middelware2" + req.url);
        next();
    }];
}

/**
 * Module exports
 */
module.exports["client:js"]         = clientScript;
module.exports["client:events"]     = clientEvents;
//module.exports["server:middleware"] = serverMiddleware;
module.exports.plugin               = plugin;
module.exports.name                 = PLUGIN_NAME;
module.exports.startServer          = startServer;

