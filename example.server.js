var fs = require('fs');
var bs = require('/Users/shakyshane/code/browser-sync-core-rewrite')
    .create({
        version: "3.0.0",
        serveStatic: ['/Users/shakyshane/code/browser-sync-core-rewrite/test/fixtures'],
        //reloadOnRestart: true,
        //scheme: "https",
        //proxy: {
        //    target: 'https://hype-for-type.static:8890',
        //    options: {}
        //},
        plugins: [
            './index'
        ],
        files: [
            "test/fixtures/*.html"
        ],
        externals: {
            clientJs: '/Users/shakyshane/code/bs-client'
        },
    }, function (err, out) {
        if (err) {
            return console.log(err);
        }
    });