"use strict";

var fs          = require("fs");
var connect     = require("connect");
var _           = require("lodash");
var ports       = require("portscanner-plus");
var http        = require("http");
var serveStatic = require("serve-static");
var Q           = require("q");
var url         = require("url");
var utils       = require("./server/utils");
var urls        = require("./server/urls");


var PLUGIN_NAME = "Control Panel";
var validUrls   = [{
    path: "/"
}];

/**
 * @constructor
 */
var ControlPanel = function (opts, bs) {

    opts = opts || {};

    this.logger = bs.getLogger(PLUGIN_NAME);
    this.bs     = bs;
    this.opts   = opts;

    ports.getPorts(1)
        .then(this.start.bind(this))
        .then(this.registerEvents.bind(this))
        .catch(function (e) {
            this.logger
                .setOnce("useLevelPrefixes", true)
                .error("{red:%s", e);
        }.bind(this));

    return this;
};

ControlPanel.prototype.init = function () {
    return this;
};

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

/**
 *
 */
ControlPanel.prototype.start = function (ports) {

    var deferred = Q.defer();
    var port     = ports[0];

    this.logger.info("Using port %s", port);

    var socketMw    = this.bs.getMiddleware("socket-js");
    var connectorMw = this.bs.getMiddleware("connector");

    var server = startServer(this.bs.options, socketMw, connectorMw);

    server.listen(port);

    this.logger.info("Running at: {cyan:http://localhost:%s", port);

    deferred.resolve(server);

    return deferred.promise;
};

/**
 * Interface required for BrowserSync
 * @returns {Function}
 */
function plugin(opts, bs) {
    var controlPanel = new ControlPanel(opts, bs).init();
    return controlPanel;
}

/**
 * This is where we handle events sent back from
 * @param opts
 * @param ports
 */
ControlPanel.prototype.registerEvents = function (opts, ports) {

    var bs          = this.bs;
    var sockets     = bs.io.sockets;

    sockets.on("connection", function (client) {

        sendUpdatedUrls(sockets, validUrls);

        // Events for setting options
        client.on("urls:option:set",       setOption.bind(bs));
        client.on("urls:browser:reload",   reloadAll.bind(bs));
        client.on("urls:browser:url",      sendToUrl.bind(bs, bs.getOption("urls.local")));
        client.on("urls:client:connected", function (data) {
            sendUpdatedUrls(sockets, urls.trackUrls(validUrls, data));
        });
    });
};

/**
 *
 */
function sendUpdatedUrls (sockets, urls) {
    sockets.emit("urls:urls:update", urls);
}

/**
 * Send all browsers to a URL
 */
function sendToUrl (localUrl, data) {

    var bs = this;
    data.override = true;
    data.url = data.path;
    bs.io.sockets.emit("browser:location", data);
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
    return ["urls:url-sync", "urls:log", "options:set"];
}

/**
 * Module exports
 */
module.exports["client:js"]         =
//module.exports["client:events"]     = clientEvents;

module.exports.hooks = {
    "client:js":         fs.readFileSync(__dirname + "/lib/js/includes/events.js"),
    "server:middleware": function () {
        return function (req, res, next) {
            next();
        };
    }
};

module.exports.plugin               = plugin;
module.exports["plugin:name"]       = PLUGIN_NAME;
module.exports.startServer          = startServer;
module.exports.sendToUrl            = sendToUrl;

