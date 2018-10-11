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
            view: 'home-component',
            isActive: true,
            components: [{
                type: 'menu-component',
                items: [{
                    text: 'What is PlazarJS?',
                    view: 'description-component',
                }]
            }]
        }, {
            text: 'Todo',
            view: 'todo-component'
        }, {
            text: 'About',
            view: 'about-component'
        }]
    }]
});