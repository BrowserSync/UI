"use strict";

var EE          = require("easy-extender");

var async       = require("./server/async");
var hooks       = require("./server/hooks");
var config      = require("./server/config");
var merge       = require("./server/opts").merge;

var defaultPlugins = {
    "sync-options": require("./server/plugins/sync-options/sync-options"),
    "server-info":  require("./server/plugins/server-info/server-info"),
    "history":      require("./server/plugins/history/history"),
    "plugins":      require("./server/plugins/plugins/plugins"),
    "remote-debug": require("./server/plugins/remote-debug/remote-debug"),
    "connections":  require("./server/plugins/connections/connections")
};

/**
 * @param {Object} opts - Any options specifically
 *                        passed to the control panel
 * @param {BrowserSync} bs
 * @returns {ControlPanel}
 * @constructor
 */
var ControlPanel = function (opts, bs, emitter) {

    var cp            = this;
    cp.bs             = bs;
    cp.config         = config.merge();
    cp.events         = emitter;
    cp.opts           = merge(opts);
    cp.logger         = bs.getLogger(cp.config.get("pluginName"));
    cp.defaultPlugins = defaultPlugins;

    if (cp.opts.get("logLevel") === "silent") {
        cp.logger.mute(true);
    }

    cp.pluginManager = new EE(defaultPlugins, hooks).init();

    return cp;
};

/**
 * @param cb
 */
ControlPanel.prototype.getServer = function (cb) {
    var cp = this;
    if (!cp.server) {
        this.events.on("cp:running", function () {
            cb(null, cp.server);
        });
    }
};

/**
 * Detect an available port
 * @returns {ControlPanel}
 */
ControlPanel.prototype.init = function () {

    var cp = this;
    var asyncTasks = [
        {
            step: "Setting default plugins",
            fn:   async.initDefaultHooks
        },
        {
            step: "Finding a free port",
            fn:   async.findAFreePort
        },
        {
            step: "Starting the Control Panel Server",
            fn:   async.startServer
        },
        {
            step: "Registering default plugins",
            fn:   async.registerPlugins
        },
        {
            step: "Add options setting event",
            fn:   async.addOptionsEvent
        }
    ];

    require("async").eachSeries(asyncTasks, function (item, cb) {
        cp.logger.debug("Starting Step: " + item.step);
        item.fn(cp, function (err, out) {
            if (err) {
                return cb(err);
            }
            if (out) {
                if (out.options) {
                    Object.keys(out.options).forEach(function (key) {
                        cp.opts = cp.opts.set(key, out.options[key]);
                    });
                }
                if (out.optionsIn) {
                    out.optionsIn.forEach(function (item) {
                        cp.opts = cp.opts.setIn(item.path, item.value);
                    });
                }
                if (out.instance) {
                    Object.keys(out.instance).forEach(function (key) {
                        cp[key] = out.instance[key];
                    });
                }
            }
            cp.logger.debug("{green:Step Complete: " + item.step);
            cb();
        });
    }, function () {
        cp.events.emit("cp:running", {instance: cp, options: cp.opts});
        cp.logger.info("Running at: {cyan:http://localhost:%s", cp.opts.get("port"));
    });

    return this;
};

/**
 * These hooks are for attaching functionality to BrowserSync
 */
module.exports.hooks = {
    /**
     * Client JS is added to each connected client
     */
    "client:js":         require("fs").readFileSync(__dirname + config.defaults.clientJs)
};

/**
 * BrowserSync Plugin interface
 * @param opts
 * @param bs
 * @returns {ControlPanel}
 */
module.exports["plugin"] = function (opts, bs) {
    var Events       = require("events").EventEmitter;
    var emitter      = new Events();
    var controlPanel = new ControlPanel(opts, bs, emitter);
    controlPanel.init();
    return controlPanel;
};

module.exports["plugin:name"]       = config.defaults.pluginName;