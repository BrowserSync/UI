"use strict";

var fs          = require("fs");
var connect     = require("connect");
var _           = require("lodash");
var path        = require("path");
var through     = require("through");
var ports       = require("portscanner-plus");
var http        = require("http");
var serveStatic = require("serve-static");
var Q           = require("q");
var EE          = require("easy-extender");

var hooks       = require("./server/hooks");

var defaultPlugins = {
    "ghostmode":   require("./server/plugins/ghostmode/ghostMode"),
    "locations":   require("./server/plugins/locations/locations"),
    "server-info": require("./server/plugins/server-info/server-info"),
    "plugins":     require("./server/plugins/plugins/plugins")
};

var PLUGIN_NAME = "Control Panel";

/**
 * @constructor
 */
var ControlPanel = function (opts, bs) {

    opts = opts || {};

    this.logger = bs.getLogger(PLUGIN_NAME);
    this.bs     = bs;
    this.opts   = opts;

    this.pluginManager = new EE(defaultPlugins, hooks);

    this.pluginManager.init();

    this.pageMarkup = this.pluginManager.hook("markup");
    this.clientJs   = this.pluginManager.hook("client:js");
    this.templates  = this.pluginManager.hook("templates");

    ports.getPorts(1)
        .then(this.start.bind(this))
        .then(this.registerPlugins.bind(this))
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

function startServer(controlPanel, socketMw, connectorMw) {

    var app     = connect();
    var options = controlPanel.bs.options;

    _.each(controlPanel.templates, function (template, path) {
        app.use("/" + path, function (req, res, next) {
            res.setHeader("Content-Type", "text/html");
            res.end(template);
        });
    });

    app.use("/js/vendor/socket.js", socketMw);
    app.use("/js/connector", connectorMw);

    app.use("/js/app.js", function (req, res, next) {
        res.setHeader("Content-Type", "application/javascript");
        res.end(controlPanel.clientJs);
    });

    app.use(function (req, res, next) {
        if (req.url === "/") {
            res.setHeader("Content-Type", "text/html");
            return fs.createReadStream(__dirname + "/lib/index.html")
                .pipe(through(function (buffer) {
                    var file = buffer.toString();
                    this.queue(file.replace(/%hooks%/g, controlPanel.pageMarkup));
                }))
                .pipe(res);
        } else {
            next();
        }
    });
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

    transformOptions(this.bs);
    
    var server = startServer(
        this,
        socketMw,
        connectorMw);

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
 * Transform server options to offer additional functionality
 * @param bs
 */
function transformOptions(bs) {

    var options = bs.options;
    var server  = options.server;
    var cwd     = bs.cwd;

    /**
     *
     * Transform server option
     *
     */
    if (server) {
        if (Array.isArray(server.baseDir)) {
            server.baseDirs = options.server.baseDir.map(function (item) {
                return path.join(cwd, item);
            });
        } else {
            server.baseDirs = [path.join(cwd, server.baseDir)];
        }
    }

    /**
     *
     * Transform Plugins option
     *
     */
    options.userPlugins = bs.getUserPlugins().filter(function (item) {
        return item !== PLUGIN_NAME;
    }).map(function (item) {
        return {
            name: item,
            active: true
        };
    });
}

/**
 * @param opts
 * @param ports
 */
ControlPanel.prototype.registerPlugins = function (opts, ports) {
    this.pluginManager.get("ghostmode")(this, this.bs);
    this.pluginManager.get("locations")(this, this.bs);
    this.pluginManager.get("server-info")(this, this.bs);
    this.pluginManager.get("plugins")(this, this.bs);
};

/**
 * Module exports
 */
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

