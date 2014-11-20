

exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    baseUrl: process.env["BS_CP_BASE"],
    specs: [
        '*.js',
        //'e2e.history.js',
    ]
};