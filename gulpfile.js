var pkg = require('./package.json')
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var header = require('gulp-header');
var footer = require('gulp-footer');

var source = [
    'src/core/plazar-core.js',
    'src/statics/plazar-http.js',
    'src/statics/plazar-binder.js',
    'src/statics/utils/plazar-array.js',
    'src/statics/utils/plazar-string.js',
    'src/statics/utils/plazar-dom.js',
    'src/statics/utils/plazar-object.js',
    'src/components/base/plazar-base.js',
    'src/components/plazar-class.js',
    'src/components/plazar-component.js',
    'src/components/plazar-mixin.js'
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

var headerBanner = function() {
    return [
        '// PlazarJS',
        '// version: ' + pkg.version,
        '// author: ' + pkg.author,
        '// license: ' + pkg.license,
        '(function (global, factory) {',
        '   typeof exports === \'object\' && typeof module !== \'undefined\' ? module.exports = factory() :',
        '   typeof define === \'function\' && define.amd ? define(factory) :',
        '   (global.pz = factory());',
        '}(this, (function () { \'use strict\';'
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
        '// version: ' + pkg.version,
        '// author: ' + pkg.author,
        '// license: ' + pkg.license,
        '(function (global, factory) {',
        '   typeof exports === \'object\' && typeof module !== \'undefined\' ? module.exports = (function() {',
        '       if(global.pz === undefined) { global.pz = require(\'plazar\') };',
        '       return factory(global.pz)',
        '   })() :',
        '   typeof define === \'function\' && define.amd ? define([\'plazar\'], function(pz) { return factory(pz); }) :',
        '   (factory(global.pz));',
        '}(this, (function (pz) { \'use strict\';'
      ].join('\n') + '\n';
};

var footerBannerBootstrap = function() {
    return '})));';
};

gulp.task('build', function() {

    pz = gulp.src(source)
        .pipe(concat('plazar.js'))
        .pipe(header(headerBanner()))
        .pipe(footer(footerBanner()))
        .pipe(gulp.dest('dist'));

    pzMin = pz.pipe(concat('plazar.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));

    return pzMin;
});

gulp.task('build-bootstrap', function() {
    
    pzBootstrap = gulp.src(bootstrapSource)
        .pipe(concat('plazar-ui-bootstrap.js'))
        .pipe(header(headerBannerBootstrap()))
        .pipe(footer(footerBannerBootstrap()))
        .pipe(gulp.dest('dist'));

    pzBootstrapMin = pzBootstrap.pipe(concat('plazar-ui-bootstrap.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));

    return pzBootstrapMin;
});