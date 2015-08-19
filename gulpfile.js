"use strict";

var gulp        = require("gulp");
var jshint      = require("gulp-jshint");
var contribs    = require("gulp-contribs");
var sass        = require("gulp-sass");
var autoprefix  = require("gulp-autoprefixer");
var rename      = require("gulp-rename");
var filter      = require("gulp-filter");
var uglify      = require("gulp-uglify");
var minifyCSS   = require("gulp-minify-css");
var easysvg     = require("easy-svg");
var browserSync = require("browser-sync");
var crossbow    = require("crossbow");

/**
 * Lint all JS files
 */
gulp.task("lint", function () {
    return gulp.src([
        "test/client/specs/**/*.js",
        "test/server/**/*.js",
        "lib/**/*.js",
        "public/js/scripts/*.js",
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
    return gulp.src("README.md")
        .pipe(contribs())
        .pipe(gulp.dest(""));
});

/**
 * Build the app.
 */
gulp.task("js", function () {
    return gulp.src('public/js/app.js')
        .pipe(uglify())
        .pipe(rename('app.min.js'))
        .pipe(gulp.dest("public/js"));
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
    browserSync({
        notify: false,
        server: ["./static", "./public"],
        plugins: [
            {
                "bs-html-injector": {}
            }
        ]
    });
});

/**
 * Compile CSS
 */
gulp.task("sass", function () {
    return gulp.src("src/scss/**/*.scss")
        .pipe(sass())
        .on("error", function(err){
            browserSync.notify(err.message, 3000);
            console.log(err.message);
            this.emit("end");
        })
        .pipe(autoprefix())
        .pipe(gulp.dest("public/css"))
        .pipe(minifyCSS({keepBreaks:true}))
        .pipe(filter("**/*.css"))
        .pipe(rename("core.min.css"))
        .pipe(gulp.dest("public/css"))
        .on("end", function () {
            browserSync.reload();
        });
});

/**
 * Compile HTML
 */
gulp.task("crossbow", function () {
    return gulp.src([
        "src/crossbow/*.hbs",
        "src/crossbow/components/*.hbs",
        "src/crossbow/content/*.hbs"
    ])
        .pipe(crossbow.stream({
            config: {
                base: "src/crossbow"
            },
            data: {
                site: "file:_config.yml"
            }
        }))
        .pipe(gulp.dest("./static"))
        .on("end", function () {
            browserSync.reload();
        });
});

/**
 * Compile SVG Symbols
 */
gulp.task("svg", function () {
    return gulp.src("src/svg/*.svg")
        .pipe(easysvg.stream({js: false}))
        .pipe(gulp.dest("public/img/icons"));
});

/**
 * Build Front-end stuff
 */
gulp.task("dev-frontend", ["crossbow", "browser-sync-dev"], function () {
    gulp.watch("src/scss/**/*.scss", ["sass"]);
    gulp.watch(["src/crossbow/**"], ["crossbow"]);
});

gulp.task("build", ["sass", "js"]);
