exports.config = {
    seleniumAddress: "http://localhost:4444/wd/hub",
    specs: [
        process.env["BS_TEST_FILE"]
        //"tests/remote-debug.js",
        //"tests/home.js",
        //"tests/history.js",
        //"tests/network-throttle.js"
    ]
};