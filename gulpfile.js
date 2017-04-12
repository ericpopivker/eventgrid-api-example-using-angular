var gulp = require('gulp');
var uglifyjs = require('gulp-uglifyjs');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var clean = require('gulp-clean');
var gulpif = require('gulp-if');
var useref = require('gulp-useref');
var cleanCSS = require('gulp-clean-css');
var templateCache = require('gulp-angular-templatecache');
var concat = require('gulp-concat');

gulp.task('template', function () {
    return gulp.src('app/templates/**/*.html')
        .pipe(templateCache({root: 'templates/', module: 'app'}))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('build-css', function () {
    gulp.src('app/styles/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('app/styles'));
});

gulp.task('build-css:watch', function () {
    gulp.watch('app/styles/*.scss', ['build-css']);
});

gulp.task('clean-css', function () {
    return gulp.src(['app/styles/*.css', 'app/styles/*.map'], {read: false})
        .pipe(clean());
});

gulp.task('html', ['build-css'], function () {
    return gulp.src('app/index.html')
        .pipe(useref({searchPath: ['./app', './']}))
        .pipe(gulpif('*.js', uglifyjs()))
        .pipe(gulpif('*.css', cleanCSS()))
        .pipe(gulp.dest('dist'));
});

gulp.task('concat', ['template', 'html'], function() {
    return gulp.src('dist/js/*.js')
        .pipe(concat('app.js'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('build', ['concat'], function () {
    return gulp.src(['dist/js/templates.js'], {read: false})
        .pipe(clean());
});

gulp.task('default', ['build']);