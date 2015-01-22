var bspath       = "/Users/shakyshane/sites/os-browser-sync";
var htmlpath     = "/Users/shakyshane/code/bs-plugins/html-injector";

var request      = require("supertest");
var cp           = require("./../../index");
var bs           = require(bspath);
var fs           = require("fs");
var prettyJs     = require('pretty-js');

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
}, function (err, bs) {
    var cp = bs.pluginManager.getReturnValues("UI")[0].value;

    cp.getServer(function (err, server) {
        request(server)
            .get("/js/pages-config.js")
            .end(function (err, res) {
                fs.writeFileSync(__dirname + "/setup-config.js", prettyJs(res.text));
                process.exit();
            });
    })
    //console.log(cp);
});