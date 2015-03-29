exports.config = {
    seleniumAddress: "http://localhost:4444/wd/hub",
    specs: [
        //process.env["BS_TEST_FILE"]
        //"tests/history.js",
        //"tests/remote-debug.js",
        //"tests/home.js",
        //"tests/network-throttle.auto.js",
        "tests/network-throttle.remove.js",
        //"tests/network-throttle.manual.js"
    ]
};