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

    var ui     = bs.ui;

    opts       = opts       || {};
    opts.rules = opts.rules || [];

    var bsRules = bs.getOption("rewriteRules");

    if (bsRules === false) {
        bs.setOption('rewriteRules', Immutable.List([]));
    }

    opts.rules = bs.getOption("rewriteRules")
        .toJS()
        .map(utils.decorateTypes)
        .map(utils.decorateInputs)
        .map(utils.addId);

    // Get original BS snippet
    var builtin = bs.snippetMw.opts.rules
        .filter(function (item) {
            return item.id === 'bs-snippet';
        });

    bs.setRewriteRules(opts.rules.concat(builtin));

    var logger   = bs.getLogger(config.PLUGIN_NAME).info("Running...");
    var rulePath = config.OPT_PATH.concat('rules');

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
        ns: config.NS,
        config: config
    }));

    function setBsRules (rules) {
        bs.setRewriteRules(
            rules.filter(function (item) {
                return item.get('active');
            })
            .toJS()
            .concat(builtin)
        )
    }

    function updateRules (fn) {
        var rules    = ui.getOptionIn(rulePath);
        var newRules = fn(rules);
        ui.setOptionIn(rulePath, newRules);
        setBsRules(newRules);
        ui.socket.emit(config.EVENT_UPDATE, {
            rules: newRules.toJS()
        });
    }

    var methods = {
        removeRule: function (data) {
            updateRules(function (rules) {
                return rules.filter(function (item) {
                    return item.get('id') !== data.rule.id;
                });
            });
        },
        pauseRule: function (data) {
            updateRules(function (rules) {
                return rules.map(function (item) {
                    if (item.get('id') === data.rule.id) {
                        return item.set('active', data.rule.active);
                    }
                    return item;
                });
            });
        },
        replaceRules: function (data) {
            updateRules(function (rules) {
                return rules.concat(Immutable.fromJS(data));
            });
        },
        addRule: function (data) {
            var rule = {};

            if (data.match.type !== 'string') {
                var flags = getFlags(data.match.flags);
                rule.match = new RegExp(data.match.value, flags);
            } else {
                rule.match = data.match.value;
            }
            if (data.replace.type !== 'string') {
                rule.replace = new Function(data.replace.value);
            } else {
                rule.replace = data.replace.value;
            }

            updateRules(function (rules) {

                var matchedRule = rules.filter(function (item) {
                    return item.get('id') === data.id;
                });

                var without = rules.filter(function (item) {
                    return item.get('id') !== data.id;
                });

                if (matchedRule.size) {
                    rule.id = matchedRule.get(0).get('id');
                }

                var out = without.concat(
                    Immutable.fromJS(
                        [rule]
                            .map(utils.decorateTypes)
                            .map(utils.decorateInputs)
                            .map(utils.addId)
                    )
                );

                return out;
            });
        }
    };

    ui.rewriteRules = methods;

    ui.listen(config.NS, ui.rewriteRules);

    return methods;
};

function getFlags(input) {
    var whitelist = ['g', 'i', 'm'];
    return input
        .trim()
        .split('')
        .filter(function (key) {
            return whitelist.indexOf(key > -1);
        })
        .join('');
}

/**
 * Plugin name.
 * @type {string}
 */
module.exports["plugin:name"] = config.PLUGIN_NAME;
