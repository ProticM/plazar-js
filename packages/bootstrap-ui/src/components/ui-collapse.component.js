import pz from '@plazarjs/core';
import $ from 'jquery';
import uiBase from '../base/ui-base.component';

const collapse = () => {

    let _setIfNotEmpty = (me, propName) => {
        if (!pz.isEmpty(me[propName])) {
            me.html.setAttribute(('data-' + propName), me[propName]);
        };
    };

    let _setVisibility = (me, value) => {
        $(me.html).collapse(value);
    };

    return {
        type: 'ui-bootstrap-collapse',
        ownerType: 'ui-bootstrap-button',
        parseTemplate: function() {
            this.base(arguments);
            this.html.setAttribute('data-toggle', 'collapse');

            _setIfNotEmpty(this, 'target');
            _setIfNotEmpty(this, 'parent');
        },
        target: '',
        parent: '',
        init: function() {
            pz.arr.clear(this.handlers);
            this.base(arguments);
        },
        toggle: function()  {
            $(this.html).collapse('toggle');
        },
        destroy: function() {
            $(this.html).collapse('dispose');
            this.base(arguments);
        },
        show: function()  {
            _setVisibility(this, 'show');
        },
        hide: function()  {
            _setVisibility(this, 'hide');
        }
    };
};

export default uiBase.extend(collapse);
