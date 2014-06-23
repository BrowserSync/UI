var gulp       = require("gulp");
var karma      = require('gulp-karma');
var jshint     = require('gulp-jshint');
var contribs   = require('gulp-contribs');
var browserify = require('gulp-browserify');
var rename     = require('gulp-rename');

var testFiles = [
    'test/todo.js'
];

gulp.task('lint', function () {
    gulp.src(['test/client/specs/**/*.js', 'lib/js/scripts/*.js', 'index.js'])
        .pipe(jshint('test/.jshintrc'))
        .pipe(jshint.reporter("default"))
        .pipe(jshint.reporter("fail"))
});

gulp.task('contribs', function () {
    gulp.src('README.md')
        .pipe(contribs())
        .pipe(gulp.dest("./"))
});

gulp.task('browserify', function () {
    gulp.src('lib/js/scripts/index.js')
        .pipe(browserify())
        .pipe(rename("app.js"))
        .pipe(gulp.dest("./lib/js/dist"))
});

gulp.task('default', ["lint"]);

gulp.task('build', ["browserify", "lint"]);

gulp.task('dev', ["browserify"], function () {
    gulp.watch("lib/js/scripts/**/*.js", ["browserify"]);
});