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

var htmlInjector = require('bs-html-injector');

bs.use(htmlInjector, {
    logLevel: "info",
    files: [
        "test/fixtures/*.html"
    ]
});

//var dummyPlugin = "Some Pluig";
//bs.use({
//    "plugin:name": dummyPlugin,
//    "plugin": function (opts, bs) {
//        /**
//         * Configure event
//         */
//        bs.events.on("plugins:configure", function (data) {
//            if (data.name === dummyPlugin) {
//                console.log("Dummy plugin status: ", data.active);
//            }
//        });
//    }
//});

bs.use(cp, {port: 4080});

var instance = bs({
    server: {
        baseDir: "./test/fixtures"
    },
    files: [
        "test/fixtures/css/**"
    ],
    open: false
    //online: false
});