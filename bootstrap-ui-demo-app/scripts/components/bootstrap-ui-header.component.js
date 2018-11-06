pz.define('bootstrap-ui-header-component', {
    ownerType: 'ui-bootstrap-navbar',
    renderTo: 'header',
    replace: true,
    position: 'top',
    autoLoad: true,
    theme: 'dark',
    brand: {
        type: 'text',
        value: 'Company Name'
    },
    menu: {
        items: [{
            text: 'Menu Item 1'
        },{
            text: 'Menu Item 2'
        }, {
            type: 'ui-bootstrap-dropdown',
            inNav: true,
            text: 'Menu Item 3',
            menuItems: [{
                text: 'Menu Item 3.1'
            },{
                text: 'Menu Item 3.2'
            }]
        }]
    },
    components: [{
        type: 'ui-bootstrap-form',
        css: ['form-inline'],
        renderTo: 'div.navbar-collapse',
        button: {
            appearance: 'outline-success'
        },
        components: [{
            type: 'ui-bootstrap-input',
            css: ['mr-1']
        }]
    }]
});