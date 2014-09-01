"use strict";

var through     = require("through");
var fs          = require("fs");
var connect     = require("connect");
var ports       = require("portscanner-plus");
var http        = require("http");
var serveStatic = require("serve-static");
var Q           = require("q");
var path        = require("path");
var tfunk       = require("tfunk");
var utils       = require("./server/utils");

var PLUGIN_NAME = "Control Panel";

/**
 * @param options
 * @returns {*}
 */
function startServer(options, socketMw, connectorMw) {

    var app = connect();
    app.use("/js/vendor/socket.js", socketMw);
    app.use("/js/connector", connectorMw);
    app.use(serveStatic(__dirname + "/lib"));

    return http.createServer(app);
}

var log;

/**
 * @param ports
 */
function start(opts, ports) {

    var deferred = Q.defer();

    var bs     = this; // jshint ignore:line
    var port   = ports[0];

    log = bs.getLogger(PLUGIN_NAME);

    log("debug", "Using port " + port);

    var socketMw    = bs.getMiddleware("socket-js");
    var connectorMw = bs.getMiddleware("connector");

    var server = startServer(bs.options, socketMw, connectorMw);

    server.listen(port);

    log("info", tfunk("Running at: %Ccyan:http://localhost:" + port));

    deferred.resolve(server);

    return deferred.promise;
}

/**
 * Interface required for BrowserSync
 * @returns {Function}
 */
function plugin(bs, opts) {
    ports.getPorts(1)
        .then(start.bind(bs, opts))
        .then(registerEvents.bind(bs, opts));
}

/**
 * This is where we handle events sent back from
 * @param opts
 * @param ports
 */
function registerEvents(opts, ports) {

    var bs = this;
    var sockets     = bs.io.sockets;

    sockets.on("connection", function (client) {

        // Events for setting options
        client.on("cp:option:set",     setOption.bind(bs));
        client.on("cp:browser:reload", reloadAll.bind(bs));
        client.on("cp:browser:url",    sendToUrl.bind(bs, bs.options.urls.local));
    });
}

/**
 * Send all browsers to a URL
 */
function sendToUrl (localUrl, data) {
    
    //var url = path.join(localUrl, data.url);

    utils.verifyUrl(
        utils.createUrl(
            localUrl, data.path), function (err, status) {

        if (err) {
            return log("info", err);
        }

        data.override = true;
        this.io.sockets.emit("browser:location", data);

    });
}

/**
 * Simple Browser reload
 */
function reloadAll() {
    this.io.sockets.emit("browser:reload");
}

/**
 * @param data
 */
function setOption(data) {
    var bs = this;
    bs.setOption(data.key, data.value);
}

/**
 * @returns {string[]}
 */
function clientEvents() {
    return ["cp:url-sync", "cp:log", "options:set"];
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
module.exports.sendToUrl            = sendToUrl;

