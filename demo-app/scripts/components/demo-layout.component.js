plz.define('layout-component', {
    ownerType: 'base-component',
    templateSelector: 'layout-component',
    autoLoad: true,
    components: [{
        type: 'home-component'
    }, {
        type: 'menu-component',
        renderTo: '.side-menu',
        alias: 'sideMenu',
        items: [{
            text: 'Home',
            view: 'home-component'
        },{
            text: 'About',
            view: 'about-component'
        }]
    }, {
        type: 'menu-component',
        renderTo: 'nav.top-menu',
        alias: 'topMenu',
        items: [{
            text: 'Link',
            view: 'home-component'
        }]
    }]
});