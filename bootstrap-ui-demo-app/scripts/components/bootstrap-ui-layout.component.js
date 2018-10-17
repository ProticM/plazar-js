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
                        text: 'Hello Card 1'
                    },
                    footer: false,
                    body: {
                        text: 'Lorem ipsum'
                    }
                }]
            }, {
                type: 'ui-bootstrap-container',
                renderAs: 'column',
                column: {
                    lg: 4,
                    md: 4,
                    sm: 1
                }
            }, {
                type: 'ui-bootstrap-container',
                renderAs: 'column',
                column: {
                    lg: 4,
                    md: 4,
                    sm: 1
                }
            }]
        }]
    }]
});