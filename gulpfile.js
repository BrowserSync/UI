var gulp        = require("gulp");
var jshint      = require("gulp-jshint");
var contribs    = require("gulp-contribs");
var sass        = require("gulp-sass");
var autoprefix  = require("gulp-autoprefixer");
var browserify  = require("gulp-browserify");
var rename      = require("gulp-rename");
var filter      = require("gulp-filter");
var minifyCSS   = require("gulp-minify-css");
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
    gulp.src("README.md")
        .pipe(contribs())
        .pipe(gulp.dest("./"));
});


/**
 * Build the app.
 */
gulp.task("js", function () {
    return gulp.src("src/scripts/app.js")
        .pipe(browserify())
        .pipe(rename("app.js"))
        .pipe(gulp.dest("./public/js"));
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
    //browserSync.use(require("bs-html-injector"), {
    //    files: "lib/*.html"
    //});
    browserSync({
        notify: false,
        open: false,
        server: {
            baseDir: ["static", "lib"],
            directory: true
        },
        ui: false
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
gulp.task("crossbow", function () {
    crossbow.clearCache();
    //crossbow.emitter.on("_error", function (err) {
    //    console.log(err.message);
    //});
    return gulp.src(["src/crossbow/*.hbs", "src/crossbow/_components/*.hbs"])
        .pipe(crossbow({
            cwd: "src/crossbow",
            siteConfig: "src/crossbow/_config.yml"
        }))
        .pipe(gulp.dest("./static"));
});

/**
 * Compile SVG Symbols
 */
gulp.task("svg", function () {
    return gulp.src("src/svg/*.svg")
        .pipe(sprites({
            mode: "symbols",
            svgId: "svg-%f",
            templates: {
                symbols: require("fs").readFileSync("src/svg-template.tmpl", "utf-8")
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
        .pipe(gulp.dest("public/img/icons"));
});

/**
 * Build Front-end stuff
 */
gulp.task("dev-frontend", ["sass", "svg", "crossbow", "js", "browser-sync-dev"], function () {
    gulp.watch("src/scss/**/*.scss", ["sass"]);
    gulp.watch(["src/crossbow/**"], ["crossbow", browserSync.reload]);
    gulp.watch(["src/svg/**"], ["svg", "crossbow", browserSync.reload]);
    gulp.watch("src/scripts/**/*.js", ["js", browserSync.reload]);
});

gulp.task("build", ["sass", "js", "lint"]);
