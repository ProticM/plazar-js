plz.define('bootstrap-ui-layout-component', {
    ownerType: 'component',
    templateSelector: 'app-layout',
    autoLoad: true,
    components: [{
        type: 'ui-bootstrap-container',
        renderTo: 'root',
        renderAs: 'jumbotron',
        fluid: true,
        jumbotron: {
            title: {
                text:'Welcome to Bootstrap Demo',
                size: 3
            },
            leadText: 'Easily Create Application Layouts Using PlazarJS Bootstrap-UI',
            buttons: [{
                text: 'Getting Started',
                size: 'lg',
                onClick: function() {
                    alert('Getting Started');
                }
            }]
        }
    }, {
        type: 'ui-bootstrap-container',
        renderTo: 'root',
        components:[{
            type: 'ui-bootstrap-container',
            renderAs: 'row',
            components:[{
                type: 'ui-bootstrap-container',
                renderAs: 'column',
                column: {
                    lg: 4,
                    md: 2,
                    sm: 3
                },
                components: [{
                    type: 'ui-bootstrap-card',
                    header: {
                        text: 'Lorem Ipsum'
                    },
                    footer: {
                        text: 'Some Footer Text'
                    },
                    body: {
                        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ' +
                            'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ' + 
                                'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ' +
                                    'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum'
                    }
                }]
            }, {
                type: 'ui-bootstrap-container',
                renderAs: 'column',
                column: {
                    lg: 4,
                    md: 4,
                    sm: 1
                },                
                components: [{
                    type: 'ui-bootstrap-card',
                    header: {
                        text: 'Simple Form'
                    },
                    footer: false,
                    components:[{
                        type: 'ui-bootstrap-form',
                        components: [{
                            type: 'ui-bootstrap-input',
                            labelText: 'Name:',
                            placeholder: 'Enter name'
                        }, {
                            type: 'ui-bootstrap-input',
                            labelText: 'Surname:',
                            placeholder: 'Enter surname'
                        }, {
                            type: 'ui-bootstrap-input',
                            inputType: 'checkbox',
                            labelText: 'Check me'
                        }, {
                            type: 'ui-bootstrap-dropdown',
                            appearance: 'outline-secondary',
                            labelText: 'Select item:',
                            text: 'Menu Item 3',
                            menuItems: [{
                                text: 'Menu Item 3.1'
                            }, {
                                text: 'Menu Item 3.2'
                            }]
                        }]
                    }]
                }]
            }, {
                type: 'ui-bootstrap-container',
                renderAs: 'column',
                column: {
                    lg: 4,
                    md: 4,
                    sm: 1
                },
                components: [{
                    type: 'ui-bootstrap-card',
                    headerCss: ['d-flex justify-content-center'],
                    components: [{
                        type: 'ui-bootstrap-button-toolbar',
                        renderTo: 'div.card-header',
                        groups: [{
                            buttons: [{
                                text: 'Button 1',
                                size: 'sm',
                                onClick: function() {
                                    alert('Button 1');
                                }
                            }, {
                                text: 'Button 2',
                                size: 'sm',
                                appearance: 'warning',
                                onClick: function() {
                                    alert('Button 2');
                                }
                            }, {
                                type: 'ui-bootstrap-dropdown',
                                appearance: 'outline-secondary',
                                size: 'sm',
                                split: true,
                                text: 'Dropdown Button',
                                menuItems: [{
                                    text: 'Menu Item 1.1'
                                }, {
                                    text: 'Menu Item 1.2'
                                }]
                            }]
                        }]
                    }, {
                        type: 'ui-bootstrap-button',
                        appearance: 'link',
                        size: 'sm',
                        text: 'Show alert',
                        onClick: function() {
                            var parent = this.traceUp();
                            parent.addChild({
                                type: 'ui-bootstrap-alert',
                                dismissible: true,
                                appearance: 'danger',
                                text: 'This alert was created dynamically!'
                            });
                        }
                    }, {
                        type: 'ui-bootstrap-list-group',
                        renderTo: 'div.card-footer',
                        actionable: true,
                        menuItems: [{
                            text: 'List Item 1',
                            href: 'javascript:void(0)'
                        },{
                            text: 'List Item 2',
                            href: 'javascript:void(0)'
                        }]
                    }]
                }]
            }]
        }]
    }]
});