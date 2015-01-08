var cp     = require("./index");
var bs     = require("/Users/shakyshane/sites/os-browser-sync");

//var client = require("/Users/shakyshane/Sites/browser-sync-modules/browser-sync-client");
//
//client["plugin:name"] = "client:script";

bs.use(cp);

bs({
    proxy: "grenade.static",
    open: false,
    minify: false,
    //tunnel: true
    //port: 3000
});