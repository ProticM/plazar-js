plz.define('ui-bootstrap-button-group', function () {
    'use strict';

    var _parseTemplate = function () {
        var sizeCls = !plz.isEmpty(this.size) ? 'btn-group-' + this.size : '';
        this.addCss((this.vertical ? 'btn-group-vertical ' + sizeCls : 'btn-group ' + sizeCls));
        this.html.setAttribute('aria-label', 'label_' + this.id);
        this.html.setAttribute('role', this.renderAs);
    };

    return {
        ownerType: 'ui-component',
        buttons: [],
        renderAs: 'group',
        init: function () {

            var buttons = plz.arr.map(function (button) {
                return plz.isEmpty(button.type) ?
                    plz.obj.assignTo(button, { type: 'ui-bootstrap-button' }, false) : button;
            }, this.buttons);

            this.components = plz.arr.merge(this.components || [], buttons);

            plz.arr.clear(this.buttons);
            delete this.buttons;
            this.base(arguments);
        },
        vertical: false,
        template: '<div></div>',
        parseTemplate: _parseTemplate
    };
});
