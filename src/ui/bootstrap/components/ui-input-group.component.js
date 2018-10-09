plz.define('ui-bootstrap-input-group', function () {
    'use strict';

    var _const = {
        addonEmpty: 'Component of type [ui - bootstrap - input - group] requires at least one addon. See addon config docs.',
        unsupportedInputType: 'Provided input type is not supported. Please use one of the following: \'text\' or \'select\''
    };

    var _allowedComponents = [
        'ui-bootstrap-button',
        'ui-bootstrap-dropdown',
        'ui-bootstrap-input'
    ];

    var _getAddonWrapper = function (me, addon) {
        var wrapper = plz.dom.findElement(me.html, ('div.input-group-' + addon.position));
        return wrapper || (function () {
            plz.dom[addon.position](me.html, '<div class="input-group-' + addon.position + '"></div>');
            return plz.dom.findElement(me.html, ('div.input-group-' + addon.position));
        })();
    };

    var _addTextWrapper = function (wrapper, text, tempCls) {
        plz.dom.append(wrapper, '<div class="input-group-text' + (' ' + tempCls || '') + '">' + (text || '') + '</div>');
    };

    return {
        ownerType: 'ui-component',
        template: '<div class="input-group"></div>',
        parseTemplate: function () {
            var hasSize = !plz.isEmpty(this.size), addons = plz.isArray(this.addon) ? this.addon : [this.addon];
            this.addCss((hasSize ? ('input-group-' + this.size) : ''));
        },
        input: {
            type: 'text' // or select
        },
        init: function () {
            var addons, input, addons, wrapper, component;

            if (plz.isEmpty(this.addon)) {
                throw new Error(_const.addonEmpty);
            };

            if (!plz.arr.contains(['text', 'select'], this.input.type)) {
                throw new Error(_const.unsupportedInputType);
            };

            addons = plz.isArray(this.addon) ? this.addon : [this.addon];
            input = this.input.type == 'text' ? {
                type: 'ui-bootstrap-input',
                inputType: 'text'
            } : {
                type: 'ui-bootstrap-select',
                dataSource: this.input.dataSource || []
            };

            plz.arr.clear(this.components);
            this.components = [];

            plz.forEach(addons, function (addon, idx) {

                if (plz.isEmpty(addon.position)) {
                    addon.position = 'prepend';
                };

                if (addon.position == 'append') {
                    input.renderAfter = 'div.input-group-prepend';
                };

                wrapper = _getAddonWrapper(this, addon), component = {};
                if (plz.arr.contains(_allowedComponents, addon.renderAs.type)) {
                    var renderTo = ('div.input-group-' + addon.position);

                    if (addon.renderAs.type == 'ui-bootstrap-input') {
                        _addTextWrapper(wrapper, null, ('component-addon-' + idx));
                        renderTo = ('div.input-group-text.component-addon-' + idx);
                        component.simple = true;
                    };

                    if (addon.renderAs.type == 'ui-bootstrap-select') {
                        component.custom = true;
                    };

                    plz.obj.assignTo(component, addon.renderAs, false);
                    component.renderTo = renderTo;
                    this.components.push(component);
                } else {
                    _addTextWrapper(wrapper, addon.renderAs.text);
                };
            }, this);

            this.base(arguments);
            this.addChild(input);
        }
    };
});
