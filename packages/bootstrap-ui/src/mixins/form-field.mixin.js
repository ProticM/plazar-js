const formFieldMixin = () => {

    let _getHtml = (me) =>  {
        return me.inputType == 'text' ? (pz.dom.findElement(me.html, 'input') || me.html)
            : me.html;
    };

    let _setAttr = (me, name, value) => {
        let html = _getHtml(me);
        html.setAttribute(name, value);
    };

    return {
        type: 'ui-bootstrap-form-field-mix',
        ownerType: 'mixin',
        getValue: () =>  {
            let html = _getHtml(this);
            return html.value;
        },
        setValue: (value) =>  {
            let html = _getHtml(this);
            html.value = value;
        },
        setRequired: (value) =>  {
            _setAttr(this, 'required', (value || true));
        },
        setDisabled: (value) =>  {
            _setAttr(this, 'disabled', (value || true));
        },
        setReadonly: (value) =>  {
            _setAttr(this, 'readonly', (value || true));
        }
    };
};

export default formFieldMixin;