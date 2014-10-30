var _          = require("lodash");
var fs         = require("fs");
var tmpl       = fs.readFileSync(__dirname + "/templates/plugin.tmpl", "utf-8");
var configTmpl = fs.readFileSync(__dirname + "/templates/config.tmpl", "utf-8");
var configItem = fs.readFileSync(__dirname + "/templates/config.item.tmpl", "utf-8");

/**
 //*
 * @type {{markup: Function, client:js: Function, templates: Function}}
 */
module.exports = {
    /**
     * Create the url config for each section of the ui
     * @param hooks
     * @param initial
     */
    "page": function (hooks, cb) {
        var items = hooks.reduce(function (all, item) {
            return all + configItem.replace(/%(.+)%/g, function () {
                var key = arguments[1];
                if (item[key]) {
                    return item[key];
                }
            });
        }, "");

        var pagesConfig = hooks.reduce(function (joined, item) {
            if (item.path === "/") {
                joined["server-info"] = item;
            } else {
                joined[item.path.slice(1)] = item;
            }
            return joined;
        }, {});

        cb(null, pagesConfig);

        return configTmpl.replace("%when%", items)
            .replace("%pages%", JSON.stringify(pagesConfig, null, 4));
    },
    "markup": function (hooks, initial) {
        var out = hooks.reduce(function (combined, item) {
            return [combined, tmpl.replace("%markup%", item)].join("\n");
        }, "");
        return out;
    },
    "client:js": function (hooks) {
        return hooks.join(";");
    },
    "templates": function (hooks) {
        return hooks.reduce(function (combined, item) {

            if (Object.keys(item).length > 1) {

                _.each(item, function (value, key) {
                    if (!combined[key]) {
                        combined[key] = value;
                    }
                });

            } else {

                var key   = Object.keys(item)[0];
                var value = item[key];

                if (!combined[key]) {
                    combined[key] = value;
                }
            }

            return combined;
        }, {});
    }
}