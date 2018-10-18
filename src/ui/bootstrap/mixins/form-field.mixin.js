plz.define('ui-bootstrap-form-field-mix', function () {
    'use strict';

    var _getHtml = function (me) {
        return me.inputType == 'text' ? (plz.dom.findElement(me.html, 'input') || me.html)
            : me.html;
    };

    var _setAttr = function (me, name, value) {
        var html = _getHtml(me);
        html.setAttribute(name, value);
    };

    return {
        ownerType: 'mixin',
        getValue: function () {
            var html = _getHtml(this);
            return html.value;
        },
        setValue: function (value) {
            var html = _getHtml(this);
            html.value = value;
        },
        setRequired: function (value) {
            _setAttr(this, 'required', (value || true));
        },
        setDisabled: function (value) {
            _setAttr(this, 'disabled', (value || true));
        },
        setReadonly: function (value) {
            _setAttr(this, 'readonly', (value || true));
        }
    };
});
