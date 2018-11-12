pz.define('grid-component', function() {

    return {
        ownerType: 'base-component',
        mixins: ['page-mixin'],
        template: '<div class="panel b-1 has-background-white">' +
            '<div class="panel-heading mb-1 bl-0 br-0 bt-0 panel-heading-widget">{title}</div>' +
            '<div class="p-1">' +
            '<div class="columns is-marginless">' +
                '<div class="column is-marginless b-1" data-each="columns" data-attr-[data-colidx]="$index" data-attr-[data-dindex]="dataIndex" data-html="text"></div>' +
            '</div>' +
            '<div class="columns is-marginless" data-each="data as row" data-visible="data.hasData">' +
                '<div class="column is-marginless" data-each="$root.columns" data-attr-[data-rowidx]="$root.getRowIndex" data-attr-[data-colidx]="$index" data-text="$root.getColumnValue" data-attr-[data-dindex]="dataIndex"></div>' +
            '</div>' +
            '<div class="has-text-centered p-1" data-hidden="data.hasData">No data available</div>' +
            '<div>' +
        '</div>',
        renderTo: 'root', // default renderTo, this can be overridden when adding this component as a child
        viewModel: {
            title: 'Uncompleted TODOS',
            columns: [],
            data: [],
            getRowIndex: function() {
                var idx = this.rootVm.data.indexOf(this.rootVm.row);
                return idx;
            },
            getColumnValue: function() {
                var colIdx = this.el.getAttribute('data-colidx');
                var rowIdx = this.el.getAttribute('data-rowidx');
                var column = this.vm.data.getAt(rowIdx);
                return column[colIdx].value;
            }
        },
        init: function() {
            var me = this;
            this.viewModel.columns = this.columns;
            this.loadData();

            this.subscribe({
                'todo-added': function(todo) {
                    var jTodo = pz.binder.toJSON(todo);
                    me.addTodos([jTodo]);
                }
            });

            this.subscribe({
                'todo-updated': function(todo) {
                    me.loadData();
                }
            });

            this.subscribe({
                'todo-deleted': function() {
                    me.loadData();
                }
            });

            this.base(arguments);
        },
        loadData: function() {
            pz.arr.clear(this.viewModel.data);
            var uncompletedTodos = this.todoService.getUnCompleted();
            this.addTodos(uncompletedTodos);
        },
        addTodos: function(todos) {
            var keys;
            if(pz.isEmpty(todos)) {
                return;
            };
            keys = pz.obj.getKeys(todos[0]);
            pz.forEach(todos, function(todo) {
                var row = [];
                pz.forEach(keys, function(key) {
                    row.push({
                        value: pz.isFunction(todo[key]) ? todo[key](): todo[key],
                        dataIndex: key.toLowerCase()
                    });
                }, this);
                this.viewModel.data.push(row);
    
            }, this);
        },
        require: ['todo-service']
    };

});