let gulp = require('gulp');
let concat = require('gulp-concat');
let uglify = require('gulp-uglify');
let gulpFn = require('gulp-fn');
let wrap = require('./scripts/wrap');
let configs = require('./scripts/configs');

gulp.task('build', function() {

    let pz = gulp.src('./packages/core/src/**/*')
        .pipe(concat('core.js'))
        .pipe(gulpFn(function(file, enc) {
            file.contents = wrap(configs.core, './scripts/umd-wrapper.jst', file);
        })).pipe(gulp.dest('packages/core/dist'));

    let pzMin = pz.pipe(concat('core.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('packages/core/dist'));

    return pzMin;
});

gulp.task('build-bootstrap', function() {

    let pzBootstrap = gulp.src('./packages/bootstrap-ui/src/**/*')
        .pipe(concat('bootstrap-ui.js'))
        .pipe(gulpFn(function(file, enc) {
            file.contents = wrap(configs.bootstrap, './scripts/dependant-module-wrapper.jst', file);
        })).pipe(gulp.dest('packages/bootstrap-ui/dist'));  

    let pzBootstrapMin = pzBootstrap.pipe(concat('bootstrap-ui.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('packages/bootstrap-ui/dist'));

    return pzBootstrapMin;
});