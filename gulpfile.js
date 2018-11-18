let gulp = require('gulp');
let concat = require('gulp-concat');
let uglify = require('gulp-uglify');
let gulpFn = require('gulp-fn');
let wrap = require('./scripts/wrap');
let configs = require('./scripts/configs');

gulp.task('build', function() {
    return gulp.src('./packages/core/src/**/*')
        .pipe(concat('core.js'))
        .pipe(gulpFn(function(file, enc) {
            file.contents = wrap(configs.base, './scripts/umd-wrapper.jst', file);
        })).pipe(gulp.dest('packages/core/dist'))
        .pipe(concat('core.min.js'))
        .pipe(uglify())
        .pipe(gulpFn(function(file, enc) {
            file.contents = wrap(configs.base, './scripts/version.jst', file);
        })).pipe(gulp.dest('packages/core/dist'));
});

gulp.task('build-bootstrap', function() {
    return gulp.src('./packages/bootstrap-ui/src/**/*')
        .pipe(concat('bootstrap-ui.js'))
        .pipe(gulpFn(function(file, enc) {
            file.contents = wrap(configs.bootstrap, './scripts/dependant-module-wrapper.jst', file);
        })).pipe(gulp.dest('packages/bootstrap-ui/dist'))
        .pipe(concat('bootstrap-ui.min.js'))
        .pipe(uglify())
        .pipe(gulpFn(function(file, enc) {
            file.contents = wrap(configs.bootstrap, './scripts/version.jst', file);
        })).pipe(gulp.dest('packages/bootstrap-ui/dist'));
});