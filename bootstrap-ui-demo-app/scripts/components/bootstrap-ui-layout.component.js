plz.define('bootstrap-ui-layout-component', {
    ownerType: 'component',
    templateSelector: 'app-layout',
    autoLoad: true,
    components: [{
        type: 'ui-bootstrap-card',
        renderTo: 'root',
        footer: false,
        header: false,
        body: {
            title: 'Hello',
            text: 'Welcome'
        },
        buttons: [{
            text: 'Button 1',
            appearance: 'success'
        }],
        components: [{
            type: 'ui-bootstrap-dropdown',
            text: 'States',
            css: ['pull-right'],
            split: true,
            dropPosition: 'left',
            renderTo: 'div.card-footer',
            appearance: 'danger',
            menuItems: [{
                text: 'Serbia',
                href: 'http://www.google.com'
            }]
        }]
    }]
});