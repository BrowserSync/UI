var gulp        = require("gulp");
var jshint      = require('gulp-jshint');
var contribs    = require('gulp-contribs');
var sass        = require("gulp-ruby-sass");
var autoprefix  = require("gulp-autoprefixer");
var browserify  = require('gulp-browserify');
var rename      = require('gulp-rename');
var browserSync = require('browser-sync');
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
        files: ["lib/*.html", "lib/css/**"]
    });
});

/**
 * Compile CSS
 */
gulp.task('sass', function () {
    return gulp.src('lib/scss/**/*.scss')
        .pipe(sass())
        .pipe(autoprefix())
        .pipe(gulp.dest('lib/css'));
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
 * Build Front-end stuff
 */
gulp.task('dev-frontend', ["browserify", "sass", "browser-sync"], function () {
    gulp.watch("lib/js/scripts/**/*.js", ["browserify", reload]);

    gulp.watch("lib/scss/**/*.scss", ["sass"]);
});

gulp.task('default', ["lint"]);

gulp.task('build', ["browserify", "lint"]);

gulp.task('dev', ["browserify"], function () {
    gulp.watch("lib/js/scripts/**/*.js", ["browserify"]);
});

