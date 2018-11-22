pz.define('ui-bootstrap-button-toolbar', function () {

    var _parseTemplate = function () {
        this.html.setAttribute('aria-label', 'label_' + this.id);
    };

    return {
        ownerType: 'ui-bootstrap-component',
        groups: [],
        init: function () {

            var groups = pz.arr.map(function (group) {
                return pz.isEmpty(group.type) ?
                    pz.obj.assignTo(group, { type: 'ui-bootstrap-button-group' }, false) : group;
            }, this.groups);

            this.components = pz.arr.merge(this.components || [], groups);

            pz.arr.clear(this.groups);
            delete this.groups;

            this.base(arguments);
        },
        template: '<div class="btn-toolbar" role="toolbar"></div>',
        parseTemplate: _parseTemplate
    };
});
