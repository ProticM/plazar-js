import pz from '@plazarjs/core';

let bootstrapUiBase = () => {

    let _const = {
        handlerFnNotProvided: 'Handler function was not provided.'
    };

    let _initPlugin = (me, type) => {
        let plugin = me[type];
        if (pz.isEmpty(plugin) || !pz.isObject(plugin)) {
            return;
        };

        $(me.html)[type](plugin);
    };

    return {
        type: 'ui-bootstrap-component',
        ownerType: 'component',
        constructor: function() {

            let me = this;
            let sub = this.subscribe('render-complete', () => {

                if (pz.isFunction(me.parseTemplate) && !pz.isEmpty(me.template)) {
                    me.parseTemplate();
                };

                me.prependLabel();
                me.initToolTip();
                me.initPopOver();
                sub.remove();
            });

            this.base(arguments);
        },

        prependLabel: function(template) {
            if (pz.isEmpty(this.labelText)) {
                return;
            };

            let label = pz.dom.createElement('label');
            label.innerText = this.labelText;
            this.addCss('col-form-label', label);
            pz.dom.insertBefore(this.html, label);
            label = null;
        },

        initToolTip: function() {
            _initPlugin(this, 'tooltip');
        },

        initPopOver: function() {
            _initPlugin(this, 'popover');
        },

        handle: function(handler) { // override handlers binding since we need bootstrap/jquery custom events
            let me = this, $html = $(this.html);
            let fn = pz.isFunction(handler.fn) ? handler.fn : me[handler.fn];

            if (pz.isEmpty(fn)) {
                throw new Error(_const.handlerFnNotProvided);
            };

            let hasSelector = !pz.isEmpty(handler.selector);
            let args = hasSelector ? [handler.on, handler.selector, pz.proxy(fn, handler.scope || me)] :
                [handler.on, pz.proxy(fn, handler.scope || me)];
            $html.on.apply($html, args);
        },

        destroy: function() {
            $(this.html).tooltip('dispose')
                .popover('dispose');
            $(this.html).off();
            this.base(arguments);
        }
    };
};

export default pz.component.extend(bootstrapUiBase);
