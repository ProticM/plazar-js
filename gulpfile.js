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

var bootstrapSource = [
    'src/ui/bootstrap/base/ui-base.component.js',
    'src/ui/bootstrap/mixins/form-field.mixin.js',
    'src/ui/bootstrap/components/ui-alert.component.js',
    'src/ui/bootstrap/components/ui-breadcrumb.component.js',
    'src/ui/bootstrap/components/ui-button-group.component.js',
    'src/ui/bootstrap/components/ui-button-toolbar.component.js',
    'src/ui/bootstrap/components/ui-button.component.js',
    'src/ui/bootstrap/components/ui-card.component.js',
    'src/ui/bootstrap/components/ui-carousel.component.js',
    'src/ui/bootstrap/components/ui-collapse.component.js',
    'src/ui/bootstrap/components/ui-container.component.js',
    'src/ui/bootstrap/components/ui-dropdown.component.js',
    'src/ui/bootstrap/components/ui-form.component.js',
    'src/ui/bootstrap/components/ui-grid.component.js',
    'src/ui/bootstrap/components/ui-input-group.component.js',
    'src/ui/bootstrap/components/ui-input.component.js',
    'src/ui/bootstrap/components/ui-list-group.component.js',
    'src/ui/bootstrap/components/ui-modal.component.js',
    'src/ui/bootstrap/components/ui-nav.component.js',
    'src/ui/bootstrap/components/ui-navbar.component.js',
    'src/ui/bootstrap/components/ui-progress.component.js',
    'src/ui/bootstrap/components/ui-select.component.js'
];

var banner = function(bootstrap) {
    return (bootstrap ? '// Plazar JS Bootstrap UI' : '// Plazar JS') + '\n';
};

gulp.task('build', function(){
    
    plzBootstrap = gulp.src(bootstrapSource)
        .pipe(concat('plazar-js-ui-bootstrap.js'))
        .pipe(header(banner(true)))
        .pipe(gulp.dest('dist'));

    plzBootstrapMin = plzBootstrap.pipe(concat('plazar-js-ui-bootstrap.min.js'))
        .pipe(uglify())
        .pipe(header(banner(true)))
        .pipe(gulp.dest('dist'));
    
    plz = gulp.src(source)
        .pipe(concat('plazar-js.js'))
        .pipe(header(banner()))
        .pipe(gulp.dest('dist'));

    plzMin = plz.pipe(concat('plazar-js.min.js'))
        .pipe(uglify())
        .pipe(header(banner()))
        .pipe(gulp.dest('dist'));

    return plzMin;
});