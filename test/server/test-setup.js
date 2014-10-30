var bspath       = "/Users/shakyshane/sites/os-browser-sync";
var htmlpath     = "/Users/shakyshane/code/bs-plugins/html-injector";

var request      = require("supertest");
var cp           = require("./../../index");
var bs           = require(bspath);
var fs           = require("fs");
var prettyJs = require('pretty-js');

cp.events.on("cp:running", function () {
    request(cp.server)
        .get("/js/pages-config.js")
        .end(function (err, res) {
            fs.writeFileSync("./test/client/setup-config.js", prettyJs(res.text));
            process.exit();
        });
});

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