import pz from '@plazarjs/core';
import uiBase from '../base/ui-base.component';

const grid = () => {

    let _defaultColSize = 12;

    let _getColumnSizeClass = (size) => {
        let _default = 'col-' + _defaultColSize,
            lg, md, sm;

        if (pz.isEmpty(size)) {
            return _default;
        };

        lg = !pz.isEmpty(size.lg) ? 'col-lg-' + size.lg : '';
        md = !pz.isEmpty(size.md) ? ' col-md-' + size.md : '';
        sm = !pz.isEmpty(size.sm) ? ' col-sm-' + size.sm : '';

        let css = lg + md + sm;
        return !pz.isEmpty(css) ?
            css : _default;
    };

    let _parseTemplate = function() {
        let me = this;
        this.addCss((this.fluid ? 'container-fluid' : 'container'));

        pz.forEach(this.rows, (row, idx) => {
            let rowEl = pz.dom.createElement('div'), 
                generateRowId = !pz.isEmpty(row.id) || row.generateId;

            if(generateRowId) {
                me.addAttr({
                    name: 'id',
                    value: row.id || ('row-' + idx)
                }, rowEl);
            };
            
            me.addCss('row', rowEl);
            if (!pz.isEmpty(row.css)) {
                me.addCss(row.css.join(' '), rowEl);
            };
            pz.dom.append(me.html, rowEl);

            pz.forEach(row.columns, (column, idx) => {
                let sizeClass = _getColumnSizeClass(column.size),
                    columnEl = pz.dom.createElement('div'),
                    generateColumnId = !pz.isEmpty(column.id) || column.generateId;

                me.addCss(sizeClass, columnEl);
                if (!pz.isEmpty(column.css)) {
                    me.addCss(column.css, columnEl);
                };

                if(generateColumnId) {
                    me.addAttr({
                        name: 'id',
                        value: column.id || ('column-' + idx)
                    }, columnEl);
                };

                columnEl.innerHTML = !pz.isEmpty(column.text) ? 
                    column.text : '';

                pz.dom.append(rowEl, columnEl);
            });
        });
    };

    return {
        type: 'ui-bootstrap-grid',
        ownerType: 'ui-bootstrap-component',
        fluid: false,
        rows: [{
            generateId: false,
            css: [],
            columns: [{
                generateId: false,
                text: '',
                size: _defaultColSize,
                css: []
            }]
        }],
        template: '<div></div>',
        parseTemplate: _parseTemplate
    };
};

export default uiBase.extend(grid);