pz.define('ui-bootstrap-collapse', function () {

    var _setIfNotEmpty = function (me, propName) {
        if (!pz.isEmpty(me[propName])) {
            me.html.setAttribute(('data-' + propName), me[propName]);
        };
    };

    var _setVisibility = function (me, value) {
        $(me.html).collapse(value);
    };

    return {
        ownerType: 'ui-bootstrap-button',
        parseTemplate: function () {
            this.base(arguments);
            this.html.setAttribute('data-toggle', 'collapse');

            _setIfNotEmpty(this, 'target');
            _setIfNotEmpty(this, 'parent');
        },
        target: '',
        parent: '',
        init: function () {
            pz.arr.clear(this.handlers);
            this.base(arguments);
        },
        toggle: function () {
            $(this.html).collapse('toggle');
        },
        destroy: function () {
            $(this.html).collapse('dispose');
            this.base(arguments);
        },
        show: function () {
            _setVisibility(this, 'show');
        },
        hide: function () {
            _setVisibility(this, 'hide');
        }
    };
});
