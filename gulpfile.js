var corePkg = require('./packages/core/package.json');
var bootstrapUiPkg = require('./packages/bootstrap-ui/package.json');
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var replace = require('gulp-replace');
var fs = require('fs');

var source = [
    'packages/core/src/core/plazar-core.js',
    'packages/core/src/statics/plazar-http.js',
    'packages/core/src/statics/plazar-binder.js',
    'packages/core/src/statics/utils/plazar-array.js',
    'packages/core/src/statics/utils/plazar-string.js',
    'packages/core/src/statics/utils/plazar-dom.js',
    'packages/core/src/statics/utils/plazar-object.js',
    'packages/core/src/components/base/plazar-base.js',
    'packages/core/src/components/plazar-class.js',
    'packages/core/src/components/plazar-component.js',
    'packages/core/src/components/plazar-mixin.js'
];

var bootstrapSource = [
    'packages/bootstrap-ui/src/base/ui-base.component.js',
    'packages/bootstrap-ui/src/mixins/form-field.mixin.js',
    'packages/bootstrap-ui/src/components/ui-alert.component.js',
    'packages/bootstrap-ui/src/components/ui-breadcrumb.component.js',
    'packages/bootstrap-ui/src/components/ui-button-group.component.js',
    'packages/bootstrap-ui/src/components/ui-button-toolbar.component.js',
    'packages/bootstrap-ui/src/components/ui-button.component.js',
    'packages/bootstrap-ui/src/components/ui-card.component.js',
    'packages/bootstrap-ui/src/components/ui-carousel.component.js',
    'packages/bootstrap-ui/src/components/ui-collapse.component.js',
    'packages/bootstrap-ui/src/components/ui-container.component.js',
    'packages/bootstrap-ui/src/components/ui-dropdown.component.js',
    'packages/bootstrap-ui/src/components/ui-form.component.js',
    'packages/bootstrap-ui/src/components/ui-grid.component.js',
    'packages/bootstrap-ui/src/components/ui-input-group.component.js',
    'packages/bootstrap-ui/src/components/ui-input.component.js',
    'packages/bootstrap-ui/src/components/ui-list-group.component.js',
    'packages/bootstrap-ui/src/components/ui-modal.component.js',
    'packages/bootstrap-ui/src/components/ui-nav.component.js',
    'packages/bootstrap-ui/src/components/ui-navbar.component.js',
    'packages/bootstrap-ui/src/components/ui-progress.component.js',
    'packages/bootstrap-ui/src/components/ui-select.component.js'
];

gulp.task('build', function() {

    var pz = gulp.src('./scripts/umd-wrapper.jst')
        .pipe(concat('core.js'))
        .pipe(replace('###content###', function() {
            var result = [];
            source.forEach(item => {
                var text = fs.readFileSync(item, 'utf-8');
                text = text.charCodeAt(0) === 0xFEFF ? text.slice(1) : text;
                result.push(text);
            });
            return result.join('\n');
        }))
        .pipe(replace('###namespace###', 'pz'))
        .pipe(replace('###author###', corePkg.author))
        .pipe(replace('###version###', corePkg.version))
        .pipe(replace('###license###', corePkg.license))
        .pipe(gulp.dest('packages/core/dist'));

    var pzMin = pz.pipe(concat('core.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('packages/core/dist'));

    return pzMin;
});

gulp.task('build-bootstrap', function() {

    var pzBootstrap = gulp.src('./scripts/dependant-module-wrapper.jst')
        .pipe(concat('bootstrap-ui.js'))
        .pipe(replace('###content###', function() {
            var result = [];
            bootstrapSource.forEach(item => {
                var text = fs.readFileSync(item, 'utf-8');
                text = text.charCodeAt(0) === 0xFEFF ? text.slice(1) : text;
                result.push(text);
            });
            return result.join('\n');
        }))
        .pipe(replace('###namespace###', 'pz'))
        .pipe(replace('###author###', bootstrapUiPkg.author))
        .pipe(replace('###version###', bootstrapUiPkg.version))
        .pipe(replace('###license###', bootstrapUiPkg.license))
        .pipe(replace('###moduleNamespace###', 'pzBootstrap'))
        .pipe(replace('###moduleName###', 'bootstrap ui'))
        .pipe(gulp.dest('packages/bootstrap-ui/dist'));  

    var pzBootstrapMin = pzBootstrap.pipe(concat('bootstrap-ui.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('packages/bootstrap-ui/dist'));

    return pzBootstrapMin;
});