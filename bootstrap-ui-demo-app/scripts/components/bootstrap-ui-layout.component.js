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
                    md: 6,
                    sm: 12
                },
                components: [{
                    type: 'ui-bootstrap-card',
                    css: ['mb-2'],
                    header: {
                        text: 'Lorem Ipsum',
                        css: ['bg-dark text-white']
                    },
                    footer: {
                        text: 'Some Footer Text',
                        css: ['bg-dark text-white']
                    },
                    body: {
                        css: ['bg-info text-white'],
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
                    md: 6,
                    sm: 12
                },                
                components: [{
                    type: 'ui-bootstrap-card',
                    css: ['mb-2'],
                    header: {
                        text: 'Simple Form (no footer)'
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
                    md: 12,
                    sm: 12
                },
                components: [{
                    type: 'ui-bootstrap-card',
                    css: ['mb-2'],
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
                        text: 'Click to add alert!',
                        onClick: function() {
                            var parent = this.traceUp();
                            parent.addChild({
                                type: 'ui-bootstrap-alert',
                                dismissible: true,
                                appearance: 'danger',
                                text: 'This alert was created dynamically! We can dismiss this one'
                            });
                        }
                    }, {
                        type: 'ui-bootstrap-alert',
                        appearance: 'success',
                        text: 'This alert was created upon parent component initialization with dismissible option disabled!'
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
                    }, , {
                        type: 'ui-bootstrap-dropdown',
                        renderTo: 'div.card-footer',
                        appearance: 'info',
                        css: ['mt-2'],
                        split: true,
                        text: 'Dropdown Button Split',
                        menuItems: [{
                            text: 'Menu Item 1.1'
                        }, {
                            text: 'Menu Item 1.2'
                        }]
                    }]
                }]
            }]
        }, {
            type: 'ui-bootstrap-input-group',
            css: ['mb-2'],
            addon: [{
                renderAs: {
                    type: 'ui-bootstrap-input',
                    inputType: 'checkbox',
                    onChange: function() {
                        alert('change')
                    }
                }
            }, {
                renderAs: {
                    type: 'text',
                    text: '$'
                },
                position: 'append'
            }, {
                renderAs: {
                    type: 'text',
                    text: '0.00'
                },
                position: 'append'
            }]
        }]
    }, {
        type: 'ui-bootstrap-container',
        fluid: true,
        components: [{
            type: 'ui-bootstrap-input-group',
            css: ['mb-3'],
            addon: [{
                renderAs: {
                    type: 'ui-bootstrap-dropdown',
                    appearance: 'outline-secondary',
                    split: true,
                    text: 'Actions',
                    menuItems: [{
                        text: 'Action 1'
                    }, {
                        text: 'Action 2'
                    }],
                    onChange: function() {
                        alert('change')
                    }
                }
            }]
        }]
    }]
});