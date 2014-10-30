var bspath       = "/Users/shakyshane/sites/os-browser-sync";
//var bspath       = "/Users/shaneobsourne/sites/browser-sync";

var htmlpath     = "/Users/shakyshane/code/bs-plugins/html-injector";
//var htmlpath     = "/Users/shaneobsourne/code/html-injector";

var cp           = require("./index");
var bs           = require(bspath);

var htmlInjector = require(htmlpath);

bs.use(htmlInjector, {
    logLevel: "debug",
    files: [
        "test/fixtures/*.html"
    ]
});

bs.use(cp);

bs({
    server: {
        baseDir: "./test/fixtures"
    },
    open: false,
    online: false
});