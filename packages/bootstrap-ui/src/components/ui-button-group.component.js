pz.define('ui-bootstrap-button-group', function () {

    var _parseTemplate = function () {
        var sizeCls = !pz.isEmpty(this.size) ? 'btn-group-' + this.size : '';
        this.addCss((this.vertical ? 'btn-group-vertical ' + sizeCls : 'btn-group ' + sizeCls));
        this.html.setAttribute('aria-label', 'label_' + this.id);
        this.html.setAttribute('role', this.renderAs);
    };

    return {
        ownerType: 'ui-bootstrap-component',
        buttons: [],
        renderAs: 'group',
        init: function () {

            var buttons = pz.arr.map(function (button) {
                return pz.isEmpty(button.type) ?
                    pz.obj.assignTo(button, { type: 'ui-bootstrap-button' }, false) : button;
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
});
