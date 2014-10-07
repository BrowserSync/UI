var path   = "/Users/shakyshane/sites/os-browser-sync";
var cp     = require("./index");
var bs     = require(path);
var client = require("/Users/shakyshane/sites/browser-sync-modules/browser-sync-client");
//
client["plugin:name"] = "client:script";

bs.use(cp);
bs.use(client);

bs({
    server: {
        baseDir: path + "/test/fixtures"
    },
    open: false
});
