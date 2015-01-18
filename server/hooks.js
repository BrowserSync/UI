var fs         = require("fs");
var path       = require("path");
var async      = require("async");
var through2   = require("through2");
var directives = require("./directive-stripper");

var pluginTmpl = fs.readFileSync(__dirname + "/templates/plugin.tmpl", "utf-8");
var configTmpl = fs.readFileSync(__dirname + "/templates/config.tmpl", "utf-8");
var configItem = fs.readFileSync(__dirname + "/templates/config.item.tmpl", "utf-8");
var inlineTemp = fs.readFileSync(__dirname + "/templates/inline.template.tmpl", "utf-8");

/**
 *
 * @type {{markup: Function, client:js: Function, templates: Function}}
 */
module.exports = {
    /**
     * Create the url config for each section of the ui
     * @param hooks
     * @param cp
     * @param cb
     */
    "page": function (hooks, cp, cb) {

        var config = hooks
            .map(transformConfig)
            .reduce(createConfigItem, {});

        preAngular(cp.pluginManager.plugins, config, function (err, markup) {

            return cb(null, {
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
                pageMarkup: markup
            });
        });

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
        joined["server-info"] = item;
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
 * Strip some directive/templating where the only use
 * is interpolation
 */
function preAngular (plugins, config, cb) {

    var Duplex = require("stream").Duplex;
    var es     = require("event-stream");

    var out = "";

    async.eachSeries(Object.keys(plugins), function (key, done) {

        var stream = new Duplex();

        stream._read  = function () {};
        stream._write = function (out) { this.push(out); };

        stream
            .pipe(through2.obj(function (out, enc, next) {
                this.push(directives.bindOnce(out, config));
                next();
            }))
            .pipe(es.map(directives.directiveStripper.bind(null, config[key], "icon")))
            .pipe(through2.obj(function (out, enc, next) {
                this.push(angularWrap(config[key].template, out));
                next();
            }))
            .pipe(through2.obj(function (out2) {
                out += out2;
                done();
            }));

        stream.write(plugins[key].hooks.markup);

    }, function (err) {
        cb(err, out);
    });
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

