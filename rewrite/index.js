/**
 *
 * HTML Injector
 *  - a BrowserSync.io plugin.
 *
 */
var config    = require("./config");
var utils     = require("./utils");
var Immutable = require("immutable");

/**
 * @param {Object} opts
 * @param {BrowserSync} bs
 */
module.exports["plugin"] = function (opts, bs) {

    opts       = opts || {};
    opts.rules = opts.rules || [];
    opts.rules = opts.rules.map(utils.addId);
    var ui     = bs.ui;

    var normRules = opts.rules
        .map(utils.normalizeRuleForBs);
    normRules.forEach(bs.addRewriteRule.bind(bs));

    opts.rules = opts.rules
        .reduce(function (obj, item) {
            obj[item.id] = item;
            return obj;
        }, {});

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
                return item.get('id') !== data.rule.id;
            });
            ui.setOptionIn(rulePath, newRules);
            ui.socket.emit("shaksyhane:rewrite-rules:updated", {
                rules: newRules.toJS()
            });
        },
        pauseRule: function (data) {
            var rule     = data.rule;
            var rulePath = config.OPT_PATH.concat(['rules', rule.id]);
            ui.options = ui.options.updateIn(rulePath, function (item) {
                return item.set('active', rule.active);
            });
        }
    });
};

/**
 * Plugin name.
 * @type {string}
 */
module.exports["plugin:name"] = config.PLUGIN_NAME;

