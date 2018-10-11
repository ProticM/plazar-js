plz.define('grid-component', function() {

    var _addTodos = function(me, todos) {
        var keys = plz.obj.getKeys(todos[0]);
        plz.forEach(todos, function(todo) {
            var row = [];
            plz.forEach(keys, function(key) {
                row.push({
                    value: plz.isFunction(todo[key]) ? todo[key](): todo[key],
                    dataIndex: key.toLowerCase()
                });
            }, this);
            this.viewModel.data.push(row);

        }, me);
    };

    return {
        ownerType: 'base-component',
        mixins: ['page-mixin'],
        template: '<div class="panel b-1">' +
            '<div class="panel-heading mb-1 bl-0 br-0 bt-0">{title}</div>' +
            '<div class="p-1">' +
            '<div class="columns is-marginless">' +
                '<div class="column is-marginless b-1" data-each="columns" data-attr-idx="$index" data-attr-[data-dindex]="dataIndex">{text}</div>' +
            '</div>' +
            '<div class="columns is-marginless" data-each="data as row">' +
                '<div class="column is-marginless" data-each="$root.columns" data-attr-[data-rowidx]="$root.getRowIndex" data-attr-[data-idx]="$index" data-text="$root.getColumnValue" data-attr-[data-dindex]="dataIndex"></div>' +
            '</div>' +
            '<div>' +
        '</div>',
        renderTo: 'section.app-body',
        viewModel: {
            title: 'Completed TODOS:',
            columns: [],
            data: [],
            getRowIndex: function() {
                var idx = this.rootVm.data.indexOf(this.rootVm.row);
                return idx;
            },
            getColumnValue: function() {
                debugger;
                var idx = this.el.getAttribute('data-idx');
                var rowIdx = this.el.getAttribute('data-rowidx');
                var column = this.vm.data.getAt(rowIdx);
                return column.value;
            }
        },
        init: function() {
            this.viewModel.columns = this.columns;
            var completedTodos = this.todoService.getCompleted();
            _addTodos(this, completedTodos);

            this.subscribe({
                'todo-added': function(todo) {
                    var todo = plz.binder.toJSON(todo);
                    _addTodos(this, [todo]);
                }
            });
            this.base(arguments);
        },
        require: ['todo-service']
    };

});