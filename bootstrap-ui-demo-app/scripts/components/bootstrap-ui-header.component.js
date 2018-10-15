plz.define('bootstrap-ui-header-component', {
    ownerType: 'ui-bootstrap-navbar',
    renderTo: 'header',
    replace: true,
    position: 'top',
    autoLoad: true,
    theme: 'dark',
    menu: {
        items: [{
            text: 'Helloo'
        }, {
            type: 'ui-bootstrap-dropdown',
            split: true,
            text: 'Menu Item 1',
            menuItems: [{
                text: 'Menu Item 1.1'
            },{
                text: 'Menu Item 1.2'
            }]
        }]
    }
});