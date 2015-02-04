var fs         = require("fs");
var path       = require("path");

var pluginTmpl = templateFile("/plugin.tmpl");
var configTmpl = templateFile("/config.tmpl");
var configItem = templateFile("/config.item.tmpl");
var inlineTemp = templateFile("/inline.template.tmpl");

function templateFile (filepath) {
    return fs.readFileSync(__dirname + "/../templates" + filepath || "", "utf-8");
}

/**
 * @type {{page: Function, markup: Function, client:js: Function, templates: Function}}
 */
module.exports = {
    /**
     * Create the url config for each section of the ui
     * @param hooks
     * @param cp
     * @param cb
     */
    "page": function (hooks, cp) {

        var config = hooks
            .map(transformConfig)
            .reduce(createConfigItem, {});

        return {
            /**
             * pagesConfig - This is the angular configuration such as routes
             */
            pagesConfig: configTmpl
                .replace("%when%", hooks.reduce(
                    createAngularRoutes,
                    ""
                ))
                .replace("%pages%", JSON.stringify(
                    config,
                    null,
                    4
                )),
            /**
             * pagesConfig in object form
             */
            pagesObj: config,
            pageMarkup: preAngular(cp.pluginManager.plugins, config)
        };
    },
    /**
     * Controller markup for each plugin
     * @param hooks
     * @returns {*}
     */
    "markup": function (hooks) {
        return hooks.reduce(pluginTemplate, "");
    },
    /**
     * @param hooks
     * @returns {*|string}
     */
    "client:js": function (hooks) {
        return hooks.join(";");
    },
    /**
     * @param hooks
     * @returns {String}
     */
    "templates": function (hooks) {
        return createInlineTemplates(hooks);
    },
    /**
     * Allow plugins to register toggle-able elements
     * @param hooks
     * @returns {{}}
     */
    "elements": function (hooks) {
        var obj = {};
        hooks.forEach(function (elements) {
            elements.forEach(function (item) {
                if (!obj[item.name]) {
                    obj[item.name] = item;
                }
            });
        });
        return obj;
    }
};

/**
 * @param hooks
 * @returns {String}
 */
function createInlineTemplates (hooks) {
    return hooks.reduce(function (combined, item) {
        return combined + item.reduce(function (all, filepath) {
            return all + angularWrap(
                path.basename(filepath),
                fs.readFileSync(filepath));
        }, "");
    }, "");
}

/**
 * @param item
 * @returns {*}
 */
function transformConfig (item) {
    return item;
}

/**
 * @param {String} all
 * @param {Object} item
 * @returns {*}
 */
function createAngularRoutes(all, item) {
    return all + configItem.replace(/%(.+)%/g, function () {
        var key = arguments[1];
        if (item[key]) {
            return item[key];
        }
    });
}

/**
 * @param joined
 * @param item
 * @returns {*}
 */
function createConfigItem (joined, item) {
    if (item.path === "/") {
        joined["overview"] = item;
    } else {
        joined[item.path.slice(1)] = item;
    }
    return joined;
}

/**
 * @returns {*}
 */
function pluginTemplate (combined, item) {
    return [combined, pluginTmpl.replace("%markup%", item)].join("\n");
}

/**
 * @param plugins
 * @param config
 * @returns {*}
 */
function preAngular (plugins, config) {

    return Object.keys(plugins)
        .filter(function (key) {
            return config[key]; // only work on plugins that have pages
        })
        .map(function (key) {
            return angularWrap(config[key].template, bindOnce(plugins[key].hooks.markup, config[key]));
        })
        .reduce(function (combined, item) {
            return combined + item;
        }, "");
}

/**
 * @param templateName
 * @param markup
 * @returns {*}
 */
function angularWrap (templateName, markup) {
    return inlineTemp
        .replace("%content%", markup)
        .replace("%id%", templateName);
}

/**
 * @param markup
 * @param config
 * @returns {*|string}
 */
function bindOnce (markup, config) {
    return markup.toString().replace(/\{\{ctrl.section\.(.+?)\}\}/g, function ($1, $2) {
        return config[$2] || "";
    });
}

module.exports.bindOnce = bindOnce;

