var cp     = require("./index");
var bs     = require("browser-sync");

var client = require("/Users/shakyshane/Sites/browser-sync-modules/browser-sync-client");

client["plugin:name"] = "client:script";

bs.use(client);

bs.use(cp);

bs({
    proxy: "grenade.static",
    open: false,
    minify: false,
    tunnel: true
    //port: 3000
});