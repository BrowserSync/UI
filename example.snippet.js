var cp     = require("./index");
var bs     = require("browser-sync");
var htmlInjector = require("bs-html-injector");
//
//client["plugin:name"] = "client:script";

//bs.use(htmlInjector);

bs.use(cp, {logLevel: "debug"});

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

bs({
    logLevel: "silent"
});