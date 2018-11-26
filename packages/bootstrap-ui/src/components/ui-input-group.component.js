const inputGroup = () => {

    let _const = {
        addonEmpty: 'Component of type [ui-bootstrap-input-group] requires at least one addon. See addon config docs.',
        unsupportedInputType: 'Provided input type is not supported. Please use one of the following: \'ui-bootstrap-input\' or \'ui-bootstrap-select\''
    };

    let _allowedComponents = [
        'ui-bootstrap-button',
        'ui-bootstrap-dropdown',
        'ui-bootstrap-input'
    ];

    let _getAddonWrapper = (me, addon) => {
        let wrapper = pz.dom.findElement(me.html, ('div.input-group-' + addon.position));
        return wrapper || (() => {
            pz.dom[addon.position](me.html, '<div class="input-group-' + addon.position + '"></div>');
            return pz.dom.findElement(me.html, ('div.input-group-' + addon.position));
        })();
    };

    let _addTextWrapper = (wrapper, text, tempCls) => {
        pz.dom.append(wrapper, '<div class="input-group-text' + (' ' + tempCls || '') + '">' + (text || '') + '</div>');
    };

    return {
        type: 'ui-bootstrap-input-group',
        ownerType: 'ui-bootstrap-component',
        template: '<div class="input-group"></div>',
        parseTemplate: function() {
            let hasSize = !pz.isEmpty(this.size);
            this.addCss((hasSize ? ('input-group-' + this.size) : ''));
        },
        input: {
            type: 'ui-bootstrap-input' // or ui-bootstrap-select
        },
        init: function() {
            let addons, wrapper, component;

            if (pz.isEmpty(this.addon)) {
                throw new Error(_const.addonEmpty);
            };

            if (!pz.arr.contains(['ui-bootstrap-input', 'ui-bootstrap-select'], this.input.type)) {
                throw new Error(_const.unsupportedInputType);
            };

            addons = pz.isArray(this.addon) ? this.addon : [this.addon];
            pz.arr.clear(this.components);
            this.components = [];

            pz.forEach(addons, (addon, idx) => {

                if (pz.isEmpty(addon.position)) {
                    addon.position = 'prepend';
                };

                if (addon.position == 'append') {
                    this.input.renderAfter = 'div.input-group-prepend';
                };

                wrapper = _getAddonWrapper(this, addon), component = {};
                if (pz.arr.contains(_allowedComponents, addon.renderAs.type)) {
                    let renderTo = ('div.input-group-' + addon.position);

                    if (addon.renderAs.type == 'ui-bootstrap-input') {
                        _addTextWrapper(wrapper, null, ('component-addon-' + idx));
                        renderTo = ('div.input-group-text.component-addon-' + idx);
                        component.simple = true;
                    };

                    if (addon.renderAs.type == 'ui-bootstrap-select') {
                        component.custom = true;
                    };

                    pz.obj.assignTo(component, addon.renderAs, false);
                    component.renderTo = renderTo;
                    this.components.push(component);
                } else {
                    _addTextWrapper(wrapper, addon.renderAs.text);
                };
            }, this);

            this.base(arguments);
            this.addChild(this.input);
        }
    };
};

export default inputGroup;