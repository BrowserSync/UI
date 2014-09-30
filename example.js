var cp = require("./index");
var bs        = require("/Users/shakyshane/sites/os-browser-sync");
var client    = require("/Users/shakyshane/sites/browser-sync-modules/browser-sync-client");

client["plugin:name"] = "client:script";

bs.use(cp);
bs.use(client);

bs({
    server: {
        baseDir: "/Users/shakyshane/sites/os-browser-sync/test/fixtures"
    },
    open: false,
    online: false
});
//gulp.task("serve", function () {
//});
