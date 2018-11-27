import pz from '@plazarjs/core';

const navBar = () => {

    let _allowedComponents = [
        'ui-bootstrap-dropdown'
        //'ui-bootstrap-input-group'
    ];

	let _parseTemplate = function() {
		let prefix = this.sticky ? 'sticky' : 'fixed';
        let hasMenuItems = !pz.isEmpty(this.menu) && !pz.isEmpty(this.menu.items);

        this.toggler = this.toggler || hasMenuItems;

        if (!pz.isEmpty(this.brand)) {
            let isTextType = this.brand.type == 'text';
            let brand = pz.dom.createElement('a');

            brand.setAttribute('href', (this.brand.href || '#'));
            this.addCss('navbar-brand', brand);

            if (isTextType) {
				brand.innerHTML = this.brand.value;
            } else {
                let brandImg = pz.dom.createElement('img');
                brandImg.setAttribute('src', this.brand.imageSrc);
                pz.dom.append(brand, brandImg);
            };

            pz.dom.append(this.html, brand);
		};

		if (this.toggler) {
			pz.dom.append(this.html, '<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapse_' + this.id + '"><span class="navbar-toggler-icon"></span></button>');
		};

        if (hasMenuItems) {
            pz.dom.append(this.html, '<div class="collapse navbar-collapse" id="collapse_' + this.id + '"></div>');

            let collapse = pz.dom.findElement(this.html, 'div#collapse_' + this.id);
            let menuPos = this.menu.position || 'left'; // left by default
            let hPositionClass = 'm'.concat(menuPos == 'left' ? 'r-' : 'l-').concat('auto');

            pz.dom.append(collapse, '<ul class="navbar-nav ' + hPositionClass + '"></ul>'); 

            let ul = pz.dom.findElement(collapse, 'ul.navbar-nav');
            pz.forEach(this.menu.items, (menuItem) => {
                if (pz.arr.contains(_allowedComponents, menuItem.type)) {
                    menuItem.renderTo = 'ul.navbar-nav';
                    this.components.push(menuItem);
                } else {
                    pz.dom.append(ul, '<li class="nav-item"><a class="nav-link" href="' + (menuItem.href || '#') + '">' + menuItem.text + '</a></li>');
                };
            }, this);
        };

        this.addCss('navbar '.concat(prefix).concat('-')
            .concat(this.position).concat(' bg-')
            .concat(this.theme).concat(' navbar-expand-lg'));
	};

    return {
        type: 'ui-bootstrap-navbar',
        ownerType: 'ui-bootstrap-component',
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
};

export default navBar;