var path = "/Users/shaneobsourne/sites/browser-sync";
var cp = require("./index");
var bs        = require(path);
var client    = require("/Users/shaneobsourne/sites/browser-sync-client");

client["plugin:name"] = "client:script";

bs.use(cp);
bs.use(client);

bs({
    server: {
        baseDir: path + "/test/fixtures"
    },
    open: false
});
