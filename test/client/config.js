module.exports = {

    // base path, that will be used to resolve files and exclude
    basePath: '../../',

    // frameworks to use
    frameworks: ['mocha'],


    // list of files / patterns to load in the browser
    files: [

        "lib/bower_components/angular/angular.min.js",
        "lib/bower_components/angular-route/angular-route.min.js",
        "lib/bower_components/angular-mocks/angular-mocks.js",
        "lib/bower_components/angular-order-object-by/src/ng-order-object-by.js",

        // Test Libs
        "node_modules/sinon/pkg/sinon.js",
        "node_modules/chai/chai.js",

        // Setup stuff
        "test/client/setup.js",
        "lib/js/dist/app.js",
        "test/client/setup-config.js",
        "server/plugins/**/*.client.js",

        // Specs
        "lib/js/templates/**/*.html",
        "server/plugins/**/*.html",

        "test/client/specs/**/*.js"
        // Templates
    ],


    // list of files to exclude
    exclude: [

    ],


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['dots'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['Firefox'],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,

    //preprocessors: {
    //    'lib/js/templates/**/*.html' : ['html2js']
    //},
    preprocessors: {
        "lib/js/templates/**/*.html": ["ng-html2js"],
        "server/plugins/**/*.html": ["ng-html2js"]
    },

    ngHtml2JsPreprocessor: {

        // If your build process changes the path to your templates,
        // use stripPrefix and prependPrefix to adjust it.
        cacheIdFromPath: function(filepath) {
            if (filepath.match(/^lib/)) {
                return filepath.replace(/^lib\//, "");
            }
            var path = require("path");
            return path.basename(filepath);
        },

        // the name of the Angular module to create
        moduleName: "test.templates"
    }
};