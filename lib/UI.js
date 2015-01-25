var config      = require("./config");
var Immutable   = require("immutable");
var asyncTasks  = require("./async-tasks");
var hooks       = require("./hooks");
var merge       = require("./opts").merge;

var defaultPlugins = {
    "sync-options": require("./plugins/sync-options/sync-options"),
    "overview":     require("./plugins/overview/overview"),
    "history":      require("./plugins/history/history"),
    //"plugins":      require("./plugins/plugins/plugins"),
    "remote-debug": require("./plugins/remote-debug/remote-debug"),
    "help":         require("./plugins/help/help"),
    "connections":  require("./plugins/connections/connections")
};

/**
 * @param {Object} opts - Any options specifically
 *                        passed to the control panel
 * @param {BrowserSync} bs
 * @param {EventEmitter} emitter
 * @constructor
 * @returns {UI}
 */
var UI = function (opts, bs, emitter) {

    var ui            = this;
    ui.bs             = bs;
    ui.config         = config.merge();
    ui.events         = emitter;
    ui.opts           = merge(opts);
    ui.logger         = bs.getLogger(ui.config.get("pluginName"));
    ui.defaultPlugins = defaultPlugins;
    ui.clients        = bs.io.of(bs.options.getIn(["socket", "namespace"]));
    ui.socket         = bs.io.of(ui.config.getIn(["socket", "namespace"]));
    ui.options        = Immutable.Map();

    if (ui.opts.get("logLevel")) {
        ui.logger.setLevel(ui.opts.get("logLevel"));
    }

    ui.pluginManager = new bs.utils.easyExtender(defaultPlugins, hooks).init();

    return ui;
};

/**
 * Detect an available port
 * @returns {UI}
 */
UI.prototype.init = function () {

    var ui = this;

    ui.bs.utils.async.eachSeries(
        asyncTasks,
        taskRunner(ui),
        tasksComplete(ui)
    );

    return this;
};

/**
 * @param cb
 */
UI.prototype.getServer = function (cb) {
    var ui = this;
    if (ui.server) {
        return ui.server;
    }
    this.events.on("cp:running", function () {
        cb(null, ui.server);
    });
};

/**
 * Run each setup task in sequence
 * @param ui
 * @returns {Function}
 */
function taskRunner (ui) {
    return function (item, cb) {
        ui.logger.debug("Starting Step: " + item.step);
        item.fn(ui, function (err, out) {
            if (err) {
                return cb(err);
            }
            if (out) {
                if (out.options) {
                    Object.keys(out.options).forEach(function (key) {
                        ui.opts = ui.opts.set(key, out.options[key]);
                    });
                }
                if (out.optionsIn) {
                    out.optionsIn.forEach(function (item) {
                        ui.opts = ui.opts.setIn(item.path, item.value);
                    });
                }
                if (out.instance) {
                    Object.keys(out.instance).forEach(function (key) {
                        ui[key] = out.instance[key];
                    });
                }
            }
            ui.logger.debug("{green:Step Complete: " + item.step);
            cb();
        });
    }
}

/**
 * All async tasks complete at this point
 * @param ui
 */
function tasksComplete (ui) {
    ui.events.emit("cp:running", {instance: ui, options: ui.opts});
    ui.logger.info("Running at: {magenta:http://localhost:%s", ui.opts.get("port"));
}

module.exports = UI;