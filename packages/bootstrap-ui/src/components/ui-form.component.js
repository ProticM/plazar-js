const form = () => {

    var _parseTemplate = () => {
        var hasAction = !pz.isEmpty(this.action), hasMethod = !pz.isEmpty(this.method);

        if (hasAction) {
            this.setAttribute('action', this.action);
        };

        if (hasMethod) {
            this.setAttribute('method', this.method);
        };

        this.addCss((this.inline ? 'form-inline' : ''));
    };

    return {
        type: 'ui-bootstrap-form',
        ownerType: 'ui-bootstrap-component',
        template: '<form></form>',
        inline: false,
        components: [],
        button: {
            text: 'Submit',
            appearance: 'primary',
            type: 'submit',
            align: 'right',
            css: []
        },
        init: () => {

            pz.forEach(this.components, (component) => {
                component.inForm = component.type == 'ui-bootstrap-input';
            }, this);

            if (!pz.isEmpty(this.button)) {
                var button = {
                    type: 'ui-bootstrap-button',
                    text: this.button.text || 'Submit',
                    appearance: this.button.appearance || 'primary',
                    buttonType: this.button.type || 'submit',
                    css: this.button.css || [],
                    align: this.button.align || 'right'
                };

                if (pz.isFunction(this.button.onClick)) {
                    button.onClick = this.button.onClick;
                };

                this.components.push(button);
            };

            this.base(arguments);
        },
        parseTemplate: _parseTemplate,
        validate: () => {

        }
    };
};

export default form;