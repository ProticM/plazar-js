const dropdown = () => {

    let _parseTemplate = () => {
        let hasSize = !pz.isEmpty(this.size), btn, hasPosition =
            !pz.isEmpty(this.dropPosition), hasHeader = !pz.isEmpty(this.menuHeaderText),
            hasAppearance = !pz.isEmpty(this.appearance);

        if (this.split) {
            pz.dom.prepend(this.html, '<button type="button" class="btn' + (hasAppearance ? (' btn-' + this.appearance) : '') + '">' + this.text + '</button>');
            this.html.className = this.html.className.replace('dropdown', 'btn-group');
        };

        if (hasPosition) {
            this.html.className = this.html.className.replace('dropdown', 'btn-group');
            this.addCss(('drop' + this.dropPosition));
        };

        let btn = pz.dom.findElement(this.html, (this.inNav ? 'a' : 'button') + '.dropdown-toggle');
        this.addCss(((hasAppearance ? ('btn-' + this.appearance) : '') + (hasSize ? (' btn-' + this.size) : '') + (this.split ? ' dropdown-toggle-split' : '')), btn);
        btn[this.split ? 'innerHTML' : 'innerText'] = (this.split ? '<span class="sr-only">Toggle Dropdown</span>' : this.text);

        let cls = 'dropdown-menu';
        pz.dom.append(this.html, '<div class="' + cls + '"></div>');
        let menuWrapper = pz.dom.findElement(this.html, 'div.dropdown-menu');

        if (hasHeader) {
            pz.dom.append(menuWrapper, '<h6 class="dropdown-header">' + this.menuHeaderText + '</h6>');
        };

        if (!pz.isEmpty(this.components)) {
            return;
        };

        pz.forEach(this.menuItems, (item) => {
            pz.dom.append(menuWrapper, '<a class="dropdown-item" href="' + (item.href || '#') + '">' + item.text + '</a>');
            if (item.divide) {
                pz.dom.append(menuWrapper, '<div class="dropdown-divider"></div>');
            };
        });
    };

    return {
        type: 'ui-bootstrap-dropdown',
        ownerType: 'ui-bootstrap-component',
        template: '<div class="dropdown"><button class="btn dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button></div>',
        handlers:[{
            on: 'show.bs.dropdown',
            fn: 'onDropdownShow'
        }, {
            on: 'shown.bs.dropdown',
            fn: 'onDropdownShown'
        }, {
            on: 'hide.bs.dropdown',
            fn: 'onDropdownHide'
        }, {
            on: 'hidden.bs.dropdown',
            fn: 'onDropdownHidden'
        }],
        load: () => {
            let parent = this.traceUp();
            let isInNav = !pz.isEmpty(parent) && pz.arr.contains([parent.type, parent.ownerType], 'ui-bootstrap-navbar');
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
        destroy: () => {
            $(this.html).dropdown('dispose');
            this.base(arguments);
        },
        toggle: () => {
            $(this.html).dropdown('toggle');
        },
        update: () => {
            $(this.html).dropdown('update');
        },
        onDropdownShow: () => { },
        onDropdownShown: () => { },
        onDropdownHide: () => { },
        onDropdownHidden: () => { }
    };
};

export default dropdown;