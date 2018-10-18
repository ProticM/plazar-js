plz.define('ui-bootstrap-dropdown', function () {
    'use strict';

    var _parseTemplate = function () {
        var hasSize = !plz.isEmpty(this.size), btn, hasPosition =
            !plz.isEmpty(this.dropPosition), hasHeader = !plz.isEmpty(this.menuHeaderText),
            hasAppearance = !plz.isEmpty(this.appearance);

        if (this.split) {
            plz.dom.prepend(this.html, '<button type="button" class="btn' + (hasAppearance ? (' btn-' + this.appearance) : '') + '">' + this.text + '</button>');
            this.html.className = this.html.className.replace('dropdown', 'btn-group');
        };

        if (hasPosition) {
            this.html.className = this.html.className.replace('dropdown', 'btn-group');
            this.addCss(('drop' + this.dropPosition));
        };

        var btn = plz.dom.findElement(this.html, (this.inNav ? 'a' : 'button') + '.dropdown-toggle');
        this.addCss(((hasAppearance ? ('btn-' + this.appearance) : '') + (hasSize ? (' btn-' + this.size) : '') + (this.split ? ' dropdown-toggle-split' : '')), btn);
        btn[this.split ? 'innerHTML' : 'innerText'] = (this.split ? '<span class="sr-only">Toggle Dropdown</span>' : this.text);

        var cls = 'dropdown-menu';
        plz.dom.append(this.html, '<div class="' + cls + '"></div>');
        var menuWrapper = plz.dom.findElement(this.html, 'div.dropdown-menu');

        if (hasHeader) {
            plz.dom.append(menuWrapper, '<h6 class="dropdown-header">' + this.menuHeaderText + '</h6>');
        };

        if (!plz.isEmpty(this.components)) {
            return;
        };

        plz.forEach(this.menuItems, function (item) {
            plz.dom.append(menuWrapper, '<a class="dropdown-item" href="' + (item.href || '#') + '">' + item.text + '</a>');
            if (item.divide) {
                plz.dom.append(menuWrapper, '<div class="dropdown-divider"></div>');
            };
        });
    };

    return {
        ownerType: 'ui-bootstrap-component',
        template: '<div class="dropdown"><button class="btn dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button></div>',
        load: function () {
            var parent = this.traceUp();
            var isInNav = !plz.isEmpty(parent) && plz.arr.contains([parent.type, parent.ownerType], 'ui-bootstrap-navbar');
            this.inNav = this.inNav || isInNav;
            if (this.inNav) {
                this.template = '<li class="nav-item dropdown"><a class="nav-link dropdown-toggle" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></a></div>';
                this.appearance = null;
            };
            this.base(arguments);
        },
        containerElement: 'div.dropdown-menu',
        appearance: 'primary',
        text: 'Dropdown',
        split: false,
        menuItems: [],
        parseTemplate: _parseTemplate,
        destroy: function () {
            $(this.html).dropdown('dispose');
            this.base(arguments);
        },
        toggle: function () {
            $(this.html).dropdown('toggle');
        },
        update: function () {
            $(this.html).dropdown('update');
        }
    };
});
