plz.define('ui-bootstrap-navbar', function () {
    'use strict';

    var _allowedComponents = [
        'ui-bootstrap-dropdown'
        //'ui-bootstrap-input-group'
    ];

	var _parseTemplate = function () {
		var prefix = this.sticky ? 'sticky' : 'fixed';
        var hasMenuItems = !plz.isEmpty(this.menu) && !plz.isEmpty(this.menu.items);

        this.toggler = this.toggler || hasMenuItems;

        if (!plz.isEmpty(this.brand)) {
            var isTextType = this.brand.type == 'text';
            var brand = plz.dom.createElement('a');

            brand.setAttribute('href', (this.brand.href || '#'));
            this.addCss('navbar-brand', brand);

            if (isTextType) {
				brand.innerHTML = this.brand.value;
            } else {
                var brandImg = plz.dom.createElement('img');
                brandImg.setAttribute('src', this.brand.url);
                plz.dom.append(brand, brandImg);
            };

            plz.dom.append(this.html, brand);
		};

		if (this.toggler) {
			plz.dom.append(this.html, '<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapse_' + this.id + '"><span class="navbar-toggler-icon"></span></button>');
		};

        if (hasMenuItems) {
            plz.dom.append(this.html, '<div class="collapse navbar-collapse" id="collapse_' + this.id + '"></div>');

            var collapse = plz.dom.findElement(this.html, 'div#collapse_' + this.id);
            var menuPos = this.menu.position || 'left'; // left by default
            var hPositionClass = 'm'.concat(menuPos == 'left' ? 'r-' : 'l-').concat('auto');

            plz.dom.append(collapse, '<ul class="navbar-nav ' + hPositionClass + '"></ul>'); 

            var ul = plz.dom.findElement(collapse, 'ul.navbar-nav');
            plz.forEach(this.menu.items, function (menuItem) {
                if (plz.arr.contains(_allowedComponents, menuItem.type)) {
                    menuItem.renderTo = 'ul.navbar-nav';
                    this.components.push(menuItem);
                } else {
                    plz.dom.append(ul, '<li class="nav-item"><a class="nav-link" href="' + (menuItem.href || '#') + '">' + menuItem.text + '</a></li>');
                };
            }, this);
        };

        this.addCss('navbar '.concat(prefix).concat('-')
            .concat(this.position).concat(' navbar-')
            .concat(this.theme).concat(' bg-')
            .concat(this.theme).concat(' navbar-expand-lg'));
	};

    return {
        ownerType: 'ui-component',
        position: 'top',
        template: '<nav></nav>',
        theme: 'light',
        components: [],
        menu: {},
		brand: {
			type: 'text',
			value: 'My app'
		},
		sticky: false,
		toggler: false,
		parseTemplate: _parseTemplate
	};
});
