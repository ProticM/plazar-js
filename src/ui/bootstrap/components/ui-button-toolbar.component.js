plz.define('ui-bootstrap-button-toolbar', function () {
    'use strict';

    var _parseTemplate = function () {
        this.html.setAttribute('aria-label', 'label_' + this.id);
    };

    return {
        ownerType: 'ui-component',
        groups: [],
        init: function () {

            var groups = plz.arr.map(function (group) {
                return plz.isEmpty(group.type) ?
                    plz.obj.assignTo(group, { type: 'ui-bootstrap-button-group' }, false) : group;
            }, this.groups);

            this.components = plz.arr.merge(this.components || [], groups);

            plz.arr.clear(this.groups);
            delete this.groups;

            this.base(arguments);
        },
        template: '<div class="btn-toolbar" role="toolbar"></div>',
        parseTemplate: _parseTemplate
    };
});
