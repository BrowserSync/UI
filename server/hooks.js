var _       = require("lodash");
var fs      = require("fs");
var tmpl    = fs.readFileSync(__dirname + "/templates/plugin.tmpl", "utf-8");
var js      = fs.readFileSync(__dirname + "/../lib/js/dist/app.js", "utf-8");

/**
 //* 
 * @type {{markup: Function, client:js: Function, templates: Function}}
 */
module.exports = {
    "markup": function (hooks, initial) {
        var out = hooks.reduce(function (combined, item) {
            return [combined, tmpl.replace("%markup%", item)].join("\n");
        }, "");
        return out;
    },
    "client:js": function (hooks) {
        return [js, hooks.join(";")].join(";");
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