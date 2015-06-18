"use strict";

var path       = require("path");
var eachSeries = require("async-each-series");
var ptor       = require("./runProtractor");

var tests       = [
    "history.js",
    "history.newtabs.js",
    "home.js",
    "remote-debug.js",
    "network-throttle.auto.js",
    "network-throttle.remove.js",
    "network-throttle.manual.js",
    "plugins.js",
    "plugins.inline.js"
];

var configFile  = path.resolve(__dirname + "/config.js");

eachSeries(tests, function (testFile, asyncCallback) {
    console.log("Running: %s", testFile);
    process.env["BS_TEST_FILE"] = "tests/" + testFile;
    ptor({}, configFile, function (err, out) {
        if (out) {
            console.log(out); //debugging
        }
        if (!err) {
            console.log("Tests Passed: %s", testFile);
        }
        if (err) {
            return asyncCallback(err);
        }

        asyncCallback();
    });
}, function (err) {
    console.log(err);
    if (err) {
        console.error(err.stdout || err.message);
        process.exit(1);
    }
    process.exit(0);
});
