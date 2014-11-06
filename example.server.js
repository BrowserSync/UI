var path           = require("path");

var bspath         = "/Users/shakyshane/sites/os-browser-sync";
var config         = path.resolve("./test/client/e2e/config.js");
//var bspath       = "/Users/shaneobsourne/sites/browser-sync";
var htmlpath     = "/Users/shakyshane/code/bs-plugins/html-injector";
//var htmlpath     = "/Users/shaneobsourne/code/html-injector";

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
var bs           = require(bspath);

var htmlInjector = require(htmlpath);

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
    open: false,
    online: false
});