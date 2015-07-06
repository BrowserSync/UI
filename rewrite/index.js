/**
 *
 * HTML Injector
 *  - a BrowserSync.io plugin.
 *
 */
var config    = require("./config");
var Immutable = require("immutable");

/**
 * @param {Object} opts
 * @param {BrowserSync} bs
 */
module.exports["plugin"] = function (opts, bs) {

    opts       = opts || {};
    opts.rules = opts.rules || [];
    var ui     = bs.ui;

    opts.rules.map(function (rule) {
        var output = {};
        if (rule.match.type === 'regex') {
            output.match = new RegExp(rule.match.input);
        } else {
            output.match = rule.match.input;
        }

        if (rule.replace.type === 'function') {

        }
    })

    var logger = bs.getLogger(config.PLUGIN_NAME).info("Running...");

    if (typeof opts.logLevel !== "undefined") {
        logger.setLevel(opts.logLevel);
    }

    ui.setOptionIn(config.OPT_PATH, Immutable.fromJS({
        name:  config.PLUGIN_SLUG,
        title: config.PLUGIN_NAME,
        active: true,
        tagline: 'Rewrite HTML on the fly',
        rules: opts.rules,
        opts: opts,
        ns: config.NS
    }));

    ui.listen(config.NS, {
        removeRule: function (data) {
            var rulePath = config.OPT_PATH.concat('rules');
            var rules    = ui.getOptionIn(rulePath);
            var newRules = rules.filter(function (item) {
                return item.get('added') !== data.rule.added;
            });
            ui.setOptionIn(rulePath, newRules);
            ui.socket.emit("shaksyhane:rewrite-rules:updated", {
                rules: newRules.toJS()
            });
        }
    });
};

/**
 * Plugin name.
 * @type {string}
 */
module.exports["plugin:name"] = config.PLUGIN_NAME;

