const button = () => {
    
    let _parseTemplate = () => {
        let hasSize = !pz.isEmpty(this.size), hasHref = !pz.isEmpty(this.href);
        this.html.innerHTML = this.text;
        this.addCss(('btn-' + this.appearance + (hasSize ? ' btn-' + this.size : '')));
        this.addCss((!pz.isEmpty(this.align) ? 'float-' + this.align : ''));
        this.html.setAttribute((hasHref ? 'href' : 'type'), (hasHref ? this.href : this.buttonType));
	};

	return {
        type: 'ui-bootstrap-button',
		ownerType: 'ui-bootstrap-component',
        appearance: 'primary',
        text: 'Button',
        buttonType: 'button',
        template: '<button class="btn"></button>',
        load: () => {
            if (!pz.isEmpty(this.href)) {
                this.template = this.template.replace('<button', '<a').replace('button>', 'a>');
            };
            this.base(arguments)
        },
        init: () => {
            if (pz.isEmpty(this.href)) {
                this.handle({
                    on: 'click',
                    fn: 'onClick'
                });
            };
            this.base(arguments);
        },
        parseTemplate: _parseTemplate,
		onClick: () => { },
        toggle: () => {
            $(this.html).button('toggle');
        },
        destroy: () => {
            $(this.html).button('dispose');
            this.base(arguments);
        },
        setDisabled: (value) => {
            // TODO: link disable
            if (pz.isEmpty(value) || value == true) {
                this.html.setAttribute('disabled', '');
            } else {
                this.html.removeAttribute('disabled');
            };
        },
        setText: (value) => {

            if (pz.isEmpty(value)) {
                return;
            };

            this.html.innerHTML = value;
        }
	};
};

export default button;