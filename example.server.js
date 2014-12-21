var path           = require("path");

var config         = path.resolve("./test/client/e2e/config.js");

var cp   = require("child_process");
var exec = require("child_process").exec;
var logger   = require("eazy-logger").Logger({
    prefix: "{magenta:[BS E2E] ",
    useLevelPrefixes: true,
    custom: {
        "i": function (string) {
            return this.compile("{cyan:" + string + "}");
        }
    }
});


var cp           = require("./index");
var bs           = require('browser-sync');

var htmlInjector = require('/Users/shakyshane/code/bs-plugins/html-injector');

bs.use(htmlInjector, {
    logLevel: "debug",
    files: [
        "test/fixtures/*.html"
    ]
});

bs.use(cp);

var instance = bs({
    server: {
        baseDir: "./test/fixtures"
    },
    open: false
    //tunnel: true
    //online: false
});