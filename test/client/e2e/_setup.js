"use strict";

var async    = require("async");
var path     = require("path");
var ptor     = require("./runProtractor");

var tests       = [
    "history.js",
    "home.js",
    "remote-debug.js"
];

var configFile  = path.resolve(__dirname + "/config.js");

async.eachSeries(tests, function (testFile, asyncCallback) {
    console.log("Running: %s", testFile);
    process.env["BS_TEST_FILE"] = "tests/" + testFile;
    ptor({}, configFile, function (err, out) {
        if (out) {
            //console.log(out); //debugging
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
    if (err) {
        console.error(err.stdout || err.message);
        process.exit(1);
    }
    process.exit(0);
});
