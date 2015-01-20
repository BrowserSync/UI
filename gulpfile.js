var gulp        = require("gulp");
var jshint      = require("gulp-jshint");
var contribs    = require("gulp-contribs");
var sass        = require("gulp-sass");
var autoprefix  = require("gulp-autoprefixer");
var browserify  = require("gulp-browserify");
var rename      = require("gulp-rename");
var filter      = require("gulp-filter");
//var minifyCSS   = require("gulp-minify-css");
var sprites     = require("gulp-svg-sprites");
var browserSync = require("browser-sync");
var crossbow    = require("crossbow/plugins/stream");

/**
 * Lint all JS files
 */
gulp.task("lint", function () {
    return gulp.src([
        "test/client/specs/**/*.js",
        "test/server/**/*.js",
        "lib/js/scripts/*.js",
        "index.js",
        "server/*.js",
        "gulpfile.js"
    ])
    .pipe(require("no-abs")())
    .pipe(jshint(".jshintrc"))
    .pipe(jshint.reporter("default"))
    .pipe(jshint.reporter("fail"));
});

/**
 * Update Contributors list
 */
gulp.task("contribs", function () {
    gulp.src("README.md")
        .pipe(contribs())
        .pipe(gulp.dest("./"));
});


/**
 * Build the app.
 */
gulp.task("browserify", function () {
    return gulp.src("lib/js/scripts/index.js")
        .pipe(browserify())
        .pipe(rename("app.js"))
        .pipe(gulp.dest("./lib/js/dist"));
});

/**
 * Start BrowserSync
 */
gulp.task("browser-sync", function () {
    browserSync({
        proxy: "http://localhost:3001/",
        files: ["lib/*.html"]
    });
});

/**
 * Start BrowserSync
 */
gulp.task("browser-sync-dev", function () {
    browserSync.use(require("./"));
    browserSync.use(require("bs-html-injector"), {
        files: "lib/*.html"
    });
    browserSync({
        notify: false,
        open: false,
        server: {
            baseDir: "lib",
            directory: true
        },
        ui: false
    });
});

/**
 * Compile CSS
 */
gulp.task("sass", function () {
    return gulp.src("lib/scss/**/*.scss")
        .pipe(sass())
        .on("error", function(err){
            browserSync.notify(err.message, 3000);
            console.log(err.message);
            this.emit("end");
        })
        .pipe(autoprefix())
        .pipe(gulp.dest("lib/css"))
        //.pipe(minifyCSS({keepBreaks:true}))
        .pipe(filter("**/*.css"))
        //.pipe(rename("core.min.css"))
        //.pipe(gulp.dest("lib/css"))
        .pipe(browserSync.reload({stream:true}));
});

/**
 * Compile CSS
 */
gulp.task("bs-inject", function () {
    browserSync.reload(["core.css", "components.css"]);
});

/**
 * Compile HTML
 */
gulp.task("build-src", function () {
    crossbow.clearCache();
    return gulp.src("lib/src/**")
        .pipe(crossbow({cwd: "lib/src"}))
        .pipe(gulp.dest("./lib"));
});

/**
 * Compile SVG Symbols
 */
gulp.task("svg", function () {
    return gulp.src("lib/img/svg/*.svg")
        .pipe(sprites({
            mode: "symbols",
            svgId: "svg-%f",
            templates: {
                symbols: require("fs").readFileSync("lib/img/svg-template.tmpl", "utf-8")
            },
            afterTransform: function (data) {
                data.svg = data.svg.map(function (item) {
                    item.raw = item.raw.replace(/ fill="(.+?)"/g, function () {
                        return "";
                    });
                    return item;
                });

                return data;
            }
        }))
        .pipe(gulp.dest("lib/img/icons"));
});

/**
 * Build Front-end stuff
 */
gulp.task("dev-frontend", ["sass", "svg", "build-src", "browserify", "browser-sync-dev"], function () {
    gulp.watch("lib/scss/**/*.scss", ["sass"]);
    gulp.watch([
        "lib/src/**"
    ], ["build-src"]);
    gulp.watch([
        "lib/img/svg/**"
    ], ["svg", "build-src", browserSync.reload]);
    gulp.watch("lib/js/scripts/**/*.js", ["browserify", browserSync.reload]);
});

gulp.task("build", ["sass", "browserify", "lint"]);
