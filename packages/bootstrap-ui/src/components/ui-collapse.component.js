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
        parseTemplate: () => {
            this.base(arguments);
            this.html.setAttribute('data-toggle', 'collapse');

            _setIfNotEmpty(this, 'target');
            _setIfNotEmpty(this, 'parent');
        },
        target: '',
        parent: '',
        init: () => {
            pz.arr.clear(this.handlers);
            this.base(arguments);
        },
        toggle: () => {
            $(this.html).collapse('toggle');
        },
        destroy: () => {
            $(this.html).collapse('dispose');
            this.base(arguments);
        },
        show: () => {
            _setVisibility(this, 'show');
        },
        hide: () => {
            _setVisibility(this, 'hide');
        }
    };
};

export default collapse;
