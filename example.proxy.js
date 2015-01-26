var cp = require("./index");
var bs = require("browser-sync");

//var client = require("/Users/shaneobsourne/sites/browser-sync-client");
//
//client["plugin:name"] = "client:script";

bs.use(cp);
//bs.use(client);

bs({
    proxy: "swoon.static",
    open: false,
    //tunnel: true
    port: 4000
});