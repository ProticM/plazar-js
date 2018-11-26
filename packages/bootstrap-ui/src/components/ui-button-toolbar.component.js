const buttonToolbar = () => {

    let _parseTemplate = function() {
        this.html.setAttribute('aria-label', 'label_' + this.id);
    };

    return {
        type: 'ui-bootstrap-button-toolbar',
        ownerType: 'ui-bootstrap-component',
        groups: [],
        init: function() {

            let groups = pz.arr.map((group) => {
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
};

export default buttonToolbar;
