plz.define('ui-bootstrap-component', function () {
    'use strict';

    var _const = {
        handlerFnNotProvided: 'Handler function was not provided.'
    };

    var _initPlugin = function (me, type) {
        var plugin = me[type];
        if (plz.isEmpty(plugin) || !plz.isObject(plugin)) {
            return;
        };

        $(me.html)[type](plugin);
    };

    return {
        ownerType: 'component',
        constructor: function () {

            this.subscribe({
                'render-complete': function () {

                    if (plz.isFunction(this.parseTemplate) && !plz.isEmpty(this.template)) {
                        this.parseTemplate();
                    };

                    this.prependLabel();
                    this.initToolTip();
                    this.initPopOver();
                }
            });

            this.base(arguments);
        },

        prependLabel: function (template) {
            if (plz.isEmpty(this.labelText)) {
                return;
            };

            var label = plz.dom.createElement('label');
            label.innerText = this.labelText;
            this.addCss('col-form-label', label);
            plz.dom.insertBefore(this.html, label);
            label = null;
        },

        initToolTip: function () {
            _initPlugin(this, 'tooltip');
        },

        initPopOver: function () {
            _initPlugin(this, 'popover');
        },

        handle: function (handler) { // override handlers binding since we need bootstrap/jquery custom events
            var me = this, $html = $(this.html);
            var fn = plz.isFunction(handler.fn) ? handler.fn : me[handler.fn];

            if (plz.isEmpty(fn)) {
                throw new Error(_const.handlerFnNotProvided);
            };

            var hasSelector = !plz.isEmpty(handler.selector);
            var args = hasSelector ? [handler.on, handler.selector, plz.proxy(fn, handler.scope || me)] :
                [handler.on, plz.proxy(fn, handler.scope || me)];
            $html.on.apply($html, args);
        },

        destroy: function () {
            $(this.html).tooltip('dispose')
                .popover('dispose');
            $(this.html).off();
            this.base(arguments);
        }
    };
});
