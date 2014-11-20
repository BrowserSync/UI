var path           = require("path");
var config         = path.resolve("./test/client/e2e/config.js");

var cp   = require("child_process");
var exec = require("child_process").exec;
var logger   = require("eazy-logger").Logger({
    prefix: "{magenta:[BS E2E] ",
    useLevelPrefixes: true,
    custom: {
        "i": function (string) {
            return this.compile("{cyan:" + string + "}");
        }
    }
});

var cp           = require("./index");
var bs           = require("browser-sync");

var htmlInjector = require("bs-html-injector");

bs.use({
    "plugin:name": "e2e test plugin",
    "plugin": function () {
        /* noop */
    }
});

bs.use(cp, {logLevel: "silent"});

cp.events.on("cp:running", function (data) {
    var address = data.instance.server.address();
    var url = "http://localhost:" + address.port;
    process.env["BS_CP"] = url;
    process.env["BS_CP_BASE"] = url;
    logger.info("Testing Control Panel at {i:%s", url);
    var out = "";
    exec("protractor " + config, function (err, stdout) {
        out += stdout;
    }).on("close", function (code) {
        if (code !== 0) {
            logger.error("Protractor tests failed, Details below");
            console.log(out);
            process.exit(code);
        } else {
            console.log(out);
            logger.info("{green:Success!} The {yellow:Protractor} test suite ran without error");
            logger.debug("Configuration file used: " + config);
            process.exit();
        }
    });
});

var instance = bs({
    server: {
        baseDir: "./test/fixtures"
    },
    logLevel: "silent",
    open: false,
    online: false
}, function (err, bs) {
    process.env["BS_URL"]  = bs.getOption("urls.local");
    process.env["BS_BASE"] = bs.getOption("urls.local");
    process.env["BS_URL_EXTERNAL"] = bs.getOption("urls.external");
    logger.info("BrowserSync running at {i:" + bs.getOption("urls.local"));
});