plz.define('todo-component', function() {

    return {
        ownerType: 'base-component',
        mixins: ['page-mixin'],
        template: '<div class="panel b-1 has-background-white">' + // template can also be retrieved from the server via ajaxSetup config
            '<div class="panel-heading mb-1 bl-0 br-0 bt-0 panel-heading-widget">Create TODO</div>' +
            '<div class="p-1">' +
            '<div class="field">' + 
                '<label class="label">Title:</label>' + 
                '<div class="control">' + 
                    '<input class="input" data-value="newTodo.title" placeholder="Example: Shopping" />' + 
                '</div>' + 
            '</div>' + 
            '<div class="field">' + 
                '<label class="label">Description:</label>' + 
                '<div class="control">' + 
                    '<textarea class="textarea" data-value="newTodo.text" placeholder="Example: Go to the grocery store"></textarea>' + 
                '</div>' + 
            '</div>' + 
            '<div class="field is-grouped">' + 
                '<div class="control">' + 
                    '<button class="button btn-add">Add</button>' + 
                '</div>' +
            '</div>' + 
            '<article data-each="todos as todo" data-visible="todos.hasData" class="message">' + 
                '<div class="message-body"><span class="has-text-weight-semibold">{title}</span> - <span>{text}</span>' +
                    '<div class="tags has-addons is-marginless d-inline-block is-pulled-right">' +
                        '<span class="tag is-marginless d-inline-block is-italic has-background-white" data-visible="isCompleted">Done</span>' +
                        '<span class="tag is-marginless d-inline-block is-italic has-background-white" data-hidden="isCompleted">Not Done</span>' +
                        '<span data-visible="isCompleted" class="tag is-marginless is-success d-inline-block"><input data-checked="isCompleted" class="is-marginless" type="checkbox"/></span>' +
                        '<span data-hidden="isCompleted" class="tag is-marginless is-danger d-inline-block"><input data-checked="isCompleted" class="is-marginless" type="checkbox"/></span>' +
                        '<span data-attr-[data-idx]="$index" class="tag is-marginless d-inline-block cursor-pointer btn-delete">Remove</span>' +
                    '</div>' +
                '</div>' + 
            '</article>' + 
            '<article data-hidden="todos.hasData" class="has-text-centered p-1">No data available</article>' +
            '</div>' +
        '</div>',
        renderTo: 'section.app-body',
        viewModel: {
            todos: [],
            newTodo: {
                text: '',
                title: '',
                isCompleted: false
            }
        },
        handlers: [{
            on: 'click',
            selector: 'span.btn-delete',
            fn: function(el) { // can be inline fn or component fn (name: String)
                var idx = el.getAttribute('data-idx');
                plz.arr.removeAt(this.viewModel.todos, idx);
                this.todoService.delete(idx);
                this.publish('todo-deleted');
            }
        }],
        init: function() {
            this.handle({ // example of dynamic event
                on: 'click',
                selector: 'button.btn-add',
                fn: 'addTodo'
            });
            plz.arr.clear(this.viewModel.todos); // TODO: See why viewModel still has todos after destroy
            var todos = this.todoService.get();
            plz.forEach(todos, function(todo) {
                this.viewModel.todos.push(plz.obj.clone(todo));
            }, this);
            
            this.base(arguments);

            plz.forEach(this.viewModel.todos, function(todo) { // subscribe to all pre-loaded todos
                var me = this;
                todo.isCompleted.subscribe(function() {
                    me.onStatusChange(todo);
                });
            }, this);
        },
        addTodo: function() {
            var todo = {
                id: this.viewModel.todos.length + 1,
                text: this.viewModel.newTodo.text(),
                title: this.viewModel.newTodo.title(),
                isCompleted: false
            }, me = this;
            this.viewModel.todos.push(todo);
            this.viewModel.newTodo.text = '';
            this.viewModel.newTodo.title = '';
            this.todoService.put(todo);
            this.publish('todo-added', todo);
            todo.isCompleted.subscribe(function() {
                me.onStatusChange(todo);
            });
        },
        onStatusChange: function(todo) {
            this.todoService.update(todo);
            this.publish('todo-updated', todo);
        },
        require: ['todo-service']
    };

});