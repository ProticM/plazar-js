plz.define('grid-component', function() {

    return {
        ownerType: 'base-component',
        mixins: ['page-mixin'],
        template: '<section class="section">' +
            '<div class="columns">' +
                '<div class="column" data-each="columns" data-attr-idx="$index" data-attr-[data-dindex]="dataIndex">{text}</div>' +
            '</div>' +
            '<div class="columns" data-each="data">' +
                '<div class="column" data-each="$root.columns" data-attr-idx="$index" data-text="$root.getColumnValue" data-attr-[data-dindex]="dataIndex"></div>' +
            '</div>' +
        '</section>',
        renderTo: 'section.app-body',
        viewModel: {
            columns: [],
            data: [],
            getColumnValue: function(el) {

            }
        },
        init: function() {
            this.viewModel.columns = this.columns;
            this.viewModel.data = this.data;

            this.subscribe({
                'todo-added': function(args) {

                }
            });
            this.base(arguments);
        }
        //require: ['todo-service']
    };

});