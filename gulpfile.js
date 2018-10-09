var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var header = require('gulp-header');

var source = [
    'src/core/plazar-js-core.js',
    'src/statics/plazar-js-http.js',
    'src/statics/plazar-js-binder.js',
    'src/statics/utils/plazar-js-array.js',
    'src/statics/utils/plazar-js-string.js',
    'src/statics/utils/plazar-js-dom.js',
    'src/statics/utils/plazar-js-object.js',
    'src/components/base/plazar-js-base.js',
    'src/components/plazar-js-class.js',
    'src/components/plazar-js-component.js',
    'src/components/plazar-js-mixin.js'
];

var banner = function() {
    return '// Plazar JS' + '\n';
};

gulp.task('build', function(){
    return gulp.src(source)
        .pipe(concat('plazar-js.min.js'))
        .pipe(uglify())
        .pipe(header(banner()))
        .pipe(gulp.dest('dist'));
});