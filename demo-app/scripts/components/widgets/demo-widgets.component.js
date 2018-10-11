plz.define('widgets-component', {
    ownerType: 'base-component',
    mixins: ['page-mixin'],
    template: '<div class="panel"><p class="panel-heading">' + 
        'Example widgets are built in purpose of this demo. Hopefully this project will grow and we will build set of controls to be supported out of the box.</p>' +
        '<div class="panel-block columns is-marginless">' +
        '<div class="column todo"></div>' +
        '<div class="column grid"></div>' +
        '</div>' +
    '</div>',
    renderTo: 'section.app-body',
    components: [{
        type: 'todo-component',
        renderTo: 'div.todo',
        mixins: []
    },{
        type: 'grid-component',
        renderTo: 'div.grid',
        mixins: [],
        columns: [{
            text: 'Column 1',
            dataIndex: 'c1'
        },{
            text: 'Column 2',
            dataIndex: 'c2'
        }],
        data: [[{
            dataIndex: 'c1',
            value: 'Hello'
        }, {
            dataIndex: 'c2',
            value: 'Hello Column 2'
        }]]
    }]
});