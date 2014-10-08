var path   = "/Users/shakyshane/sites/os-browser-sync";
var cp     = require("./index");
var bs     = require("browser-sync");
//var client = require("/Users/shakyshane/sites/browser-sync-modules/browser-sync-client");
//
//client["plugin:name"] = "client:script";

bs.use(cp);
//bs.use(client);

//bs({
//    server: {
//        baseDir: "./test/fixtures"
//    },
//    open: false
//});
//bs({
//    proxy: "swoon.static",
//    open: false
//});

bs();