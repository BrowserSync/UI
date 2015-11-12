var fs = require('fs');
//var bs = require('/Users/shakyshane/code/browser-sync-core-rewrite')
var bs = require('/Users/shakyshane/sites/oss/browser-sync-core')
    .create({
        version: "3.0.0",
        serveStatic: ['/Users/shakyshane/sites/oss/browser-sync-core/test/fixtures'],
        plugins: [
            './index'
        ],
        files: [
            "test/fixtures/*.html"
        ],
        externals: {
            //clientJs: '/Users/shakyshane/code/bs-client',
            clientJs: '/Users/shakyshane/sites/oss/browser-sync-client/' // home imac
        },
        minify: false,

        //serveStatic: ['/Users/shakyshane/code/browser-sync-core-rewrite/test/fixtures'],
        //reloadOnRestart: true,
        //scheme: "https",
        //proxy: {
        //    target: 'https://hype-for-type.static:8890',
        //    options: {}
        //},
    }, function (err, out) {
        if (err) {
            return console.log(err);
        }
    });
