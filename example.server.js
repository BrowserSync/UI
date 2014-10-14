var path         = "/Users/shakyshane/sites/os-browser-sync";
var cp           = require("./index");
var bs           = require("browser-sync");
var htmlInjector = require("bs-html-injector");

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
    open: false,
    tunnel: true
//    online: false
});