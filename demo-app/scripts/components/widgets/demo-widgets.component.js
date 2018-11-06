pz.define('widgets-component', {
    ownerType: 'base-component',
    mixins: ['page-mixin'],
    template: '<div class="panel"><p class="panel-heading">' + 
        'Example widgets are built in purpose of this demo. Hopefully PlazarJS will grow and we will build set of controls to be supported out of the box.</p>' +
        '<div class="columns is-marginless">' +
        '<div class="column todo"></div>' +
        '<div class="column grid"></div>' +
        '</div>' +
        '<div class="columns is-marginless"><div class="column user"></div></div>' +
    '</div>',
    renderTo: 'section.app-body',
    components: [{
        type: 'todo-component',
        renderTo: 'div.todo',
        mixins: []
    }, {
        type: 'grid-component',
        renderTo: 'div.grid',
        mixins: [],
        columns: [{
            text: '&#x2116;',
            dataIndex: 'id'
        }, {
            text: 'Title',
            dataIndex: 'title'
        },{
            text: 'Description',
            dataIndex: 'text'
        }],
        data: []
    }, {
        type: 'user-component',
        renderTo: 'div.user'
    }, {
        type: 'input-component',
        renderTo: 'div.grid',
        alias: 'nameField',
        label: {
            text: 'Name:'
        },
        placeholder: 'Enter name'
    }, {
        type: 'input-component',
        renderTo: 'div.grid',
        alias: 'surnameField',
        label: {
            text: 'Surname:'
        },
        placeholder: 'Enter surname'
    }, {
        type: 'select-component',
        renderTo: 'div.grid',
        label: {
            text: 'City:'
        },
        options: [{
            value: 1,
            text: 'New York'
        },{
            value: 2,
            text: 'San Francisco'
        }],
        helpText: 'Some help from this text',
        onChange: function(el) {
            alert(el.value);
        }
    }]
});