plz.define('ui-bootstrap-grid', function () {
    'use strict';

    var _defaultColSize = 12;

    var _getColumnSizeClass = function (size) {
        var _default = 'col-' + _defaultColSize,
            lg, md, sm;

        if (plz.isEmpty(size)) {
            return _default;
        };

        lg = !plz.isEmpty(size.lg) ? 'col-lg-' + size.lg : '';
        md = !plz.isEmpty(size.md) ? ' col-md-' + size.md : '';
        sm = !plz.isEmpty(size.sm) ? ' col-sm-' + size.sm : '';

        var css = lg + md + sm;
        return !plz.isEmpty(css) ?
            css : _default;
    };

    var _parseTemplate = function () {
        var me = this;
        this.addCss((this.fluid ? 'container-fluid' : 'container'));

        plz.forEach(this.rows, function (row) {
            var rowEl = plz.dom.createElement('div');
            me.addCss('row', rowEl);
            if (!plz.isEmpty(row.css)) {
                me.addCss(row.css.join(' '), rowEl);
            };
            plz.dom.append(me.html, rowEl);

            plz.forEach(row.columns, function (column) {
                var sizeClass = _getColumnSizeClass(column.size),
                    columnEl = plz.dom.createElement('div');

                me.addCss(sizeClass, columnEl);
                if (!plz.isEmpty(column.css)) {
                    me.addCss(column.css, columnEl);
                };
                plz.dom.append(rowEl, columnEl);
            });
        });
    };

    return {
        ownerType: 'ui-bootstrap-component',
        fluid: false,
        rows: [{
            css: [],
            columns: [{
                size: _defaultColSize,
                css: []
            }]
        }],
        template: '<div></div>',
        parseTemplate: _parseTemplate
    };
});
