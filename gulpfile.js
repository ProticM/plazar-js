var corePkg = require('./packages/core/package.json');
var bootstrapUiPkg = require('./packages/bootstrap-ui/package.json');
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var header = require('gulp-header');
var footer = require('gulp-footer');

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

var headerBanner = function() {
    return [
        '// PlazarJS',
        '// version: ' + corePkg.version,
        '// author: ' + corePkg.author,
        '// license: ' + corePkg.license,
        '(function (global, factory) {',
        '   typeof exports === \'object\' && typeof module !== \'undefined\' ? module.exports = factory() :',
        '   typeof define === \'function\' && define.amd ? define(factory) :',
        '   (global.pz = factory());',
        '}(this, (function () {',
        '\'use strict\';'
      ].join('\n') + '\n';
};

var footerBanner = function() {
    return [
        'return pz;',
        '})));'
    ].join('\n');
};

var headerBannerBootstrap = function() {
    return [
        '// PlazarJS Bootstrap UI',
        '// version: ' + bootstrapUiPkg.version,
        '// author: ' + bootstrapUiPkg.author,
        '// license: ' + bootstrapUiPkg.license,
        '(function (global, factory) {',
        '   typeof exports === \'object\' && typeof module !== \'undefined\' ? module.exports = (function() {',
        '       if(global.pz === undefined) { global.pz = require(\'@plazarjs/core\') };',
        '       return factory(global.pz)',
        '   })() :',
        '   typeof define === \'function\' && define.amd ? define([\'@plazarjs/core\'], function(pz) { return factory(pz); }) :',
        '   (global.pzBootstrap = factory(global.pz, true));',
        '}(this, (function (pz, autoInit) {',
        '\'use strict\';',
        'var pzBootstrap = {',
        '   init: function() {',
      ].join('\n') + '\n';
};

var footerBannerBootstrap = function() {
    return [
        '   }',
        '};',
        'if(autoInit) { pzBootstrap.init(); };',
        'return pzBootstrap;',
        '})));'
    ].join('\n') + '\n';
};

gulp.task('build', function() {

    pz = gulp.src(source)
        .pipe(concat('core.js'))
        .pipe(header(headerBanner()))
        .pipe(footer(footerBanner()))
        .pipe(gulp.dest('packages/core/dist'));

    pzMin = pz.pipe(concat('core.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('packages/core/dist'));

    return pzMin;
});

gulp.task('build-bootstrap', function() {
    
    pzBootstrap = gulp.src(bootstrapSource)
        .pipe(concat('bootstrap-ui.js'))
        .pipe(header(headerBannerBootstrap()))
        .pipe(footer(footerBannerBootstrap()))
        .pipe(gulp.dest('packages/bootstrap-ui/dist'));

    pzBootstrapMin = pzBootstrap.pipe(concat('bootstrap-ui.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('packages/bootstrap-ui/dist'));

    return pzBootstrapMin;
});