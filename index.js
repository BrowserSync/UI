"use strict";

var through   = require("through");
var fs        = require("fs");
var connect   = require("connect");
var ports     = require("portscanner-plus");
var http      = require("http");
var Q         = require("q");

var PLUGIN_NAME = "Control Panel";

/**
 * @constructor
 */
var ControlPanel = function (opts, bs) {

    this.logger = bs.getLogger(PLUGIN_NAME);
    return this;
};

ControlPanel.prototype.init = function () {

    return this;
    //ports.getPorts(1)
    //    .then(this.start.bind(this, opts, bs))
    //    .then(this.registerEvents.bind(this, opts, bs));
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
 * @param ports
 */
function start(opts, ports) {

    var deferred = Q.defer();

    var bs     = this; // jshint ignore:line
    var port   = ports[0];

    var log = bs.getLogger(PLUGIN_NAME);

    log("debug", "Using port " + port);

    var socketMw    = bs.getMiddleware("socket-js");
    var connectorMw = bs.getMiddleware("connector");

    var server = startServer(bs.options, socketMw, connectorMw);

    server.listen(port);

    log.info("Running at: {cyan:http://localhost:%s", port);

    deferred.resolve(server);

    return deferred.promise;
}

/**
 * Interface required for BrowserSync
 * @returns {Function}
 */
function plugin(opts, bs) {

    var controlPanel = new ControlPanel(opts, bs);
    return controlPanel;
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
module.exports["plugin:name"]       = PLUGIN_NAME;
module.exports.startServer          = startServer;
module.exports.sendToUrl            = sendToUrl;

