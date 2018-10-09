var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var header = require('gulp-header');
var pkg = require('./package.json');

var source = [
    'src/core/plazar-js-core.js',
    'src/statics/plazar-js-http.js',
    'src/statics/plazar-js-binder.js',
    'src/statics/plazar-js-array.js',
    'src/statics/plazar-js-string.js',
    'src/statics/plazar-js-dom.js',
    'src/statics/plazar-js-object.js',
    'src/components/base/plazar-js-base.js',
    'src/components/base/plazar-js-class.js',
    'src/components/base/plazar-js-component.js',
    'src/components/base/plazar-js-mixin.js'
];

var banner = function() {
    return [
      '// version: ' + pkg.version,
      '// author: ' + pkg.author,
      '// license: ' + pkg.licenses[0].type
    ].join('\n') + '\n';
};

gulp.task('build', function(){
    return gulp.source(source)
        .pipe(concat('plazar-js.js'))
        .pipe(header(banner()))
        .pipe(gulp.dest('dist'));
});