// Karma configuration
// Generated on Wed Sep 18 2013 18:10:53 GMT+0100 (BST)

module.exports = function (config) {
    config.set({

        // base path, that will be used to resolve files and exclude
        basePath: '../../',

        // frameworks to use
        frameworks: ['mocha'],


        // list of files / patterns to load in the browser
        files: [

            "lib/js/vendor/angular.min.js",
            "test/client/vendor/angular-mocks.js",

            // Test Libs
            "node_modules/sinon/pkg/sinon.js",
            "node_modules/chai/chai.js",

            // Setup stuff
            "test/client/setup.js",
            "lib/js/dist/app.js",

            // Specs
            "lib/js/templates/**/*.html",

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


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_WARN,


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
            "lib/js/templates/**/*.html": ["ng-html2js"]
        },

        ngHtml2JsPreprocessor: {

            // If your build process changes the path to your templates,
            // use stripPrefix and prependPrefix to adjust it.
            stripPrefix: "lib/",

            // the name of the Angular module to create
            moduleName: "test.templates"
        },

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false

    });
};
