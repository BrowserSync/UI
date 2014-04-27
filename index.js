"use strict";

var lrSnippet = require("resp-modifier");
var through   = require("through");
var fs        = require("fs");

/**
 * Return a response modifying middleware.
 * @param snippet
 * @returns {*}
 */
function getMiddleware(snippet) {
    var rules = [{
        match: /<!-- BrowserSync:scripts -->/i,
        fn: function () {
            return snippet;
        }
    }];
    return lrSnippet({rules:rules});
}

/**
 * @param connector
 * @returns {Function}
 */
function getScriptMiddleware(connector) {
    var jsFile    = "/lib/js/scripts/app.js";
    var jsUrl     = "/js/scripts/app.js";
    return function (req, res, next) {
        if (req.url === jsUrl) {
            res.setHeader("Content-Type", "text/javascript");
            return fs.createReadStream(__dirname + jsFile)
                .pipe(through(function (buffer) {
                    this.queue(connector + buffer.toString());
                }))
                .pipe(res);
        } else {
            next();
        }
    };
}

/**
 * @returns {Function}
 */
module.exports.plugin = function () {
    return function (options, snippet, connector, bs) {
        return {
            middleware: [
                getMiddleware(snippet),
                getScriptMiddleware(connector)
            ],
            baseDir: __dirname + "/lib"
        };
    };
};