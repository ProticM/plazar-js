pz.define('ui-bootstrap-input', function () {
    'use strict';

    var _parseTemplate = function () {

        var clone, tpl, label, input, hasSize = !pz.isEmpty(this.size),
            input = pz.dom.findElement(this.html, 'input') || this.html,
            hasGroup = !pz.isEmpty(this.group);

        this.addCss((hasSize ? ('form-control-' + this.size) : ''), input);
        input.setAttribute('id', ('input_' + this.id));

        if (pz.arr.contains(['text'], this.inputType)) {

            if (!this.readonly) {
                input.setAttribute('placeholder', this.placeholder);
            };

            if (this.plaintext) {
                input.className = input.className.replace('form-control', 'form-control-plaintext');
            };

            if (this.readonly) {
                input.setAttribute('readonly', '');
            };

            if (!pz.isEmpty(this.helpText)) {
                input.setAttribute('aria-describedby', ('help_' + this.id));
                pz.dom.insertAfter(input, '<small class="form-text text-muted" id="help_' + this.id + '">' + this.helpText + '</small>');
            };
            
        };

        if (pz.arr.contains(['checkbox', 'radio'], this.inputType)) {

            var isRadio = this.inputType == 'radio';

            if (isRadio && hasGroup) {
                input.setAttribute('name', this.group);
            };

            if (this.simple) {
                input.className = '';
                input.removeAttribute('class');
                return;
            };

            input.className = input.className.replace('form-control', 'form-check-input');
            clone = pz.dom.clone(input);
            tpl = pz.dom.createElement('div');

            this.addCss('form-check', tpl);
            this.addCss((this.inForm ? 'mb-3' : ''), tpl);
            this.addCss((this.inline ? 'form-check-inline' : ''), tpl);
            pz.dom.append(tpl, clone);

            if (!pz.isEmpty(this.labelText)) {
                label = pz.dom.createElement('label');
                label.innerText = this.labelText;
                this.addCss('form-check-label', label);
                label.setAttribute('for', ('input_' + this.id));
                pz.dom.append(tpl, label);
                label = null;
            };

            pz.dom.replaceWith(this.html, tpl);
            this.html = tpl;

            //if (this.inForm) {
            //    pz.dom.remove(input);
            //    pz.dom.append(this.html, tpl);
            //} else {
            //    pz.dom.replaceWith(this.html, tpl);
            //    this.html = tpl;
            //};

            tpl = null;
            clone = null;
        };
    };

    return {
        ownerType: 'ui-bootstrap-component',
        mixins: ['ui-bootstrap-form-field-mix'],
        inputType: 'text',
        inForm: false,
        readonly: false,
        placeholder: 'Enter text...',
        plaintext: false,
        inline: false,
        load: function () {
            var css = this.inputType == 'file' ? 'form-control-file' : 'form-control';
            var input = '<input class="' + css + '" type="' + this.inputType + '"/>';
            this.template = ((this.inForm && !pz.arr.contains(['checkbox', 'radio'], this.inputType)) ? '<div class="form-group">' + input + '</div>' : input);
            this.base(arguments);
        },
        parseTemplate: _parseTemplate,
        labelText: '',
        simple: false,
        helpText: '',
		handlers: [{
			on: 'change',
            fn: 'onChange'
		}],
        onChange: function (e) { },
        prependLabel: function (template) {

            if (pz.isEmpty(this.labelText) || pz.arr.contains(['checkbox', 'radio'], this.inputType)) {
                return;
            };

            var label = pz.dom.createElement('label'), hasSize = !pz.isEmpty(this.size);
            label.innerText = this.labelText;

            this.addCss('col-form-label', label);
            this.addCss((hasSize ? ('col-form-label-' + this.size) : ''), label);
            label.setAttribute('for', ('input_' + this.id));

            if (this.inForm) {
                pz.dom.prepend(this.html, label);
            } else {
                pz.dom.insertBefore(this.html, label);
            };

            label = null;
        }
	};
});
