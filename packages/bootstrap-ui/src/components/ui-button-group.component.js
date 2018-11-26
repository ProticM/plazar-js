const buttonGroup = () => {

    let _parseTemplate = function() {
        let sizeCls = !pz.isEmpty(this.size) ? 'btn-group-' + this.size : '';
        this.addCss((this.vertical ? 'btn-group-vertical ' + sizeCls : 'btn-group ' + sizeCls));
        this.html.setAttribute('aria-label', 'label_' + this.id);
        this.html.setAttribute('role', this.renderAs);
    };

    return {
        type: 'ui-bootstrap-button-group',
        ownerType: 'ui-bootstrap-component',
        buttons: [],
        renderAs: 'group',
        init: function() {

            let buttons = pz.arr.map((button) => {
                return pz.isEmpty(button.type) ?
                    pz.assignTo(button, { type: 'ui-bootstrap-button' }, false) : button;
            }, this.buttons);

            this.components = pz.arr.merge(this.components || [], buttons);

            pz.arr.clear(this.buttons);
            delete this.buttons;
            this.base(arguments);
        },
        vertical: false,
        template: '<div></div>',
        parseTemplate: _parseTemplate
    };
};

export default buttonGroup;
