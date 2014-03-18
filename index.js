"use strict";

var lrSnippet = require("resp-modifier");

/**
 * @returns {{middleware: middleware, baseDir: string}}
 */
module.exports = {
    /**
     * Get the middleware for injecting the snippets
     * @param snippet
     * @returns {*}
     */
    getMiddleware: function (snippet) {
        var rules = [{
            match: /<!-- BrowserSync:scripts -->/i,
            fn: function () {
                return snippet;
            }
        }];
        return lrSnippet({rules:rules});
    },
    plugin: function () {
        return function (options, snippet, bs) {
            return {
                middleware: this.getMiddleware(snippet),
                baseDir: __dirname + "/lib"
            }
        }.bind(this);
    }
};