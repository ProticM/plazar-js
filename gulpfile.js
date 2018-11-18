let gulp = require('gulp');
let concat = require('gulp-concat');
let uglify = require('gulp-uglify');
let gulpFn = require('gulp-fn');
let wrap = require('./scripts/wrap');
let configs = require('./scripts/configs');

let coreSrc = [
    './packages/core/src/core/plazar-core.js',
    './packages/core/src/components/base/plazar-base.js',
    './packages/core/src/**/!(plazar-core, plazar-base)*.js', // all files that end in .js EXCEPT foobar*.js
];

let buildPackage = function(packageName, tpl, config, src) {
    tpl = tpl || './scripts/dependant-module-wrapper.jst';
    config = config || configs.forModule(packageName);
    src = src || './packages/'.concat(packageName).concat('/src/**/*.js');

    let dest = './packages/'.concat(packageName).concat('/dist');

    return gulp.src(src)
        .pipe(concat(packageName.concat('.js')))
        .pipe(gulpFn(function(file, enc) {
            file.contents = wrap(config, tpl, file);
        })).pipe(gulp.dest(dest))
        .pipe(concat(packageName.concat('.min.js')))
        .pipe(uglify())
        .pipe(gulpFn(function(file, enc) {
            file.contents = wrap(config, './scripts/version.jst', file);
        })).pipe(gulp.dest(dest));
};

gulp.task('build', function() {
    return buildPackage('core', './scripts/umd-wrapper.jst', configs.base, coreSrc);
});

gulp.task('build-bootstrap', function() {
    return buildPackage('bootstrap-ui');
});

gulp.task('build-http', function() {
    return buildPackage('http');
});