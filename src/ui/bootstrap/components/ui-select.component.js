plz.define('ui-bootstrap-select', function () {
    'use strict';

    var _parseTemplate = function () {
        var hasSize = !plz.isEmpty(this.size);
        var css = (this.custom ? (hasSize ? ('custom-select custom-select-' + this.size) : 'custom-select') :
            (hasSize ? ('form-control form-control-' + this.size) : 'form-control'));
        this.addCss(css);
        if (this.multiple) {
            this.html.setAttribute('multiple', true);
        };

        plz.forEach(this.dataSource, function (item) {
            var valField = item[this.valueField],
                disField = item[this.displayField],
                option = plz.dom.createElement('option');

            option.innerText = disField;
            option.setAttribute('value', valField);
            plz.dom.append(this.html, option);
            option = null;
        }, this);
    };

    return {
        ownerType: 'ui-bootstrap-component',
        labelText:'',
        template: '<select></select>',
        mixins: ['ui-bootstrap-form-field-mix'],
        dataSource: [],
        custom: false,
        multiple: false,
        valueField: 'id',
        displayField: 'value',
        parseTemplate: _parseTemplate,
        handlers: [{
            on: 'change',
            fn: 'onChange'
        }],
        onChange: function () {
            throw new Error('Not implemented!');
        },
        setDataSource: function (data) {
            if (plz.isEmpty(data) || plz.isEmpty(this.html)) {
                return;
            };

            this.dataSource = data;
            this.parseTemplate();
        }
    };
});
