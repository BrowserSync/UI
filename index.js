"use strict";

var through   = require("through");
var fs        = require("fs");
var connect   = require("connect");
var ports     = require("portscanner-plus");
var http      = require("http");
var tfunk     = require("tfunk");

var PLUGIN_NAME = "Control Panel";

/**
 * @param options
 * @returns {*}
 */
function startServer(options, socketMw, connectorMw) {

    var app = connect();
    app.use("/js/vendor/socket.js", socketMw);
    app.use("/js/connector", connectorMw);
    app.use(connect.static(__dirname + "/lib"));

    return http.createServer(app);
}

/**
 * @param ports
 */
function start(opts, ports) {

    var bs     = this; // jshint ignore:line
    var port   = ports[0];

    var log = bs.getLogger(PLUGIN_NAME);

    log("debug", "Using port " + port);

    var socketMw    = bs.getMiddleware("socket-js");
    var connectorMw = bs.getMiddleware("connector");

    var server = startServer(bs.options, socketMw, connectorMw);

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
 * @returns {string[]}
 */
function clientEvents() {
    return ["cp:goTo", "cp:log", "options:set"];
}

/**
 * Module exports
 */
module.exports["client:js"]         = fs.readFileSync(__dirname + "/lib/js/includes/events.js");
module.exports["client:events"]     = clientEvents;
//module.exports["server:middleware"] = serverMiddleware;
module.exports.plugin               = plugin;
module.exports.name                 = PLUGIN_NAME;
module.exports.startServer          = startServer;

