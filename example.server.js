var bspath       = "/Users/shaneobsourne/sites/browser-sync";
var htmlpath     = "/Users/shaneobsourne/code/html-injector";
var cp           = require("./index");
var bs           = require(bspath);

var htmlInjector = require(htmlpath);

//var htmlInjector = require("bs-html-injector");
//var client = require("/Users/shakyshane/sites/browser-sync-modules/browser-sync-client");
//
//client["plugin:name"] = "client:script";

bs.use(htmlInjector, {
    logLevel: "debug",
    files: ["test/fixtures/*.html"]
});

bs.use(cp);

bs({
    server: {
        baseDir: "./test/fixtures"
    },
    open: false
//    online: false
});