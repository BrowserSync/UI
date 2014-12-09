var gulp        = require("gulp");
var jshint      = require('gulp-jshint');
var contribs    = require('gulp-contribs');
var sass        = require("gulp-sass");
var fs          = require("fs");
var autoprefix  = require("gulp-autoprefixer");
var browserify  = require('gulp-browserify');
var rename      = require('gulp-rename');
var filter      = require('gulp-filter');
var sprites     = require('gulp-svg-sprites');
var browserSync = require('browser-sync');
var crossbow    = require("/Users/shakyshane/code/crossbow.js");
var reload      = browserSync.reload;

/**
 * Lint all JS files
 */
gulp.task('lint', function () {
    return gulp.src(['test/client/specs/**/*.js', 'lib/js/scripts/*.js', 'index.js'])
        .pipe(jshint('test/.jshintrc'))
        .pipe(jshint.reporter("default"))
        .pipe(jshint.reporter("fail"));
});

/**
 * Update Contributors list
 */
gulp.task('contribs', function () {
    gulp.src('README.md')
        .pipe(contribs())
        .pipe(gulp.dest("./"));
});


/**
 * Build the app.
 */
gulp.task('browserify', function () {
    return gulp.src('lib/js/scripts/index.js')
        .pipe(browserify())
        .pipe(rename("app.js"))
        .pipe(gulp.dest("./lib/js/dist"));
});

/**
 * Start BrowserSync
 */
gulp.task('browser-sync', function () {
    browserSync({
        proxy: "http://localhost:3001/",
        files: ["lib/*.html"]
    });
});
/**
 * Start BrowserSync
 */
gulp.task('browser-sync-dev', function () {
    //browserSync.use(require("bs-html-injector"), {files: "lib/*.html"});
    browserSync({
        server: "lib",
        startPath: "server-info.html"
    });
});

/**
 * Compile CSS
 */
gulp.task('sass', function () {
    return gulp.src('lib/scss/**/*.scss')
        .pipe(sass())
        .on('error', function (err) { browserSync.notify(err.message); console.log(err.message) })
        .pipe(autoprefix())
        .pipe(gulp.dest('lib/css'))
        .pipe(filter("**/*.css"))
        .pipe(reload({stream:true}));
});

/**
 * Compile CSS
 */
gulp.task('bs-inject', function () {
    setTimeout(function () {
        browserSync.reload("core.css");
    }, 500);
});

/**
 * Compile HTML
 */
gulp.task('build-src', function (done) {
    var file = fs.readFileSync("lib/src/server-info.hbs", "utf-8");
    crossbow.clearCache();
    crossbow.addPage("server-info.hbs", file);
    crossbow.compileOne("server-info.hbs", {cwd: "lib/src"}, function (err, out) {
        if (!err) {
            fs.writeFileSync("lib/"  + out.paths.filePath, out.compiled);
        }
        done();
    });
});

/**
 * Compile SVG Symbols
 */
gulp.task('svg', function () {
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
        .pipe(gulp.dest("lib/img/icons"))
});

/**
 * Build Front-end stuff
 */
gulp.task('dev-frontend', ["sass", "build-src", "browser-sync-dev"], function () {
    gulp.watch("lib/scss/**/*.scss", ["sass"]);
    gulp.watch("lib/src/**/*", ["build-src", browserSync.reload]);
    //gulp.watch("lib/*.html", browserSync.reload);
});

gulp.task('watch-css', ["sass"], function () {
    gulp.watch("lib/scss/**/*.scss", ["sass"]);
});

gulp.task('default', ["lint"]);

gulp.task('build', ["browserify", "lint"]);

gulp.task('dev', ["browserify"], function () {
    gulp.watch("lib/scss/**/*.scss", ["sass"]);
    gulp.watch("lib/js/scripts/**/*.js", ["browserify"]);
});

