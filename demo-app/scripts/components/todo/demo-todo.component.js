plz.define('todo-component', function() {
    
    var _styles = [
        'is-primary',
        'is-warning',
        'is-info',
        'is-success',
        'is-danger'
    ];

    return {
        ownerType: 'base-component',
        mixins: ['page-mixin'],
        template: '<div>' + // template can also be retrieved from the server via ajaxSetup config
            '<div class="field">' + 
                '<label class="label">Add:</label>' + 
                '<div class="control">' + 
                    '<input class="input" data-value="newTodo.title" placeholder="Example: Shopping" />' + 
                '</div>' + 
            '</div>' + 
            '<div class="field">' + 
                '<div class="control">' + 
                    '<textarea class="textarea" data-value="newTodo.text" placeholder="Example: Go to the grocery store"></textarea>' + 
                '</div>' + 
            '</div>' + 
            '<div class="field is-grouped">' + 
                '<div class="control">' + 
                    '<button class="button btn-add">Add</button>' + 
                '</div>' +
            '</div>' + 
            '<div class="tile is-ancestor is-marginless">' + 
                '<div class="tile is-vertical"><p class="title">' + 
                    '<article data-each="todos" class="tile is-child notification" data-attr-class="cssStyle">' + 
                        '<p class="title">{title}</p>' +
                        '<p class="subtitle">{text}</p>' +
                    '</article>' + 
                '</p></div>' +
            '</div>' + 
        '</div>',
        renderTo: 'section.app-body',
        viewModel: {
            todos: [],
            newTodo: {
                text: '',
                title: '',
                cssStyle: 'is-primary'
            }
        },
        init: function() {
            this.handle({ // example of dynamic event
                on: 'click',
                selector: 'button.btn-add',
                fn: 'addTodo'
            });
            
            this.viewModel.todos = this.todoService.get();
            this.base(arguments);
        },
        addTodo: function() {
            var random = Math.floor((Math.random() * (5 - 0) + 0));
            var todo = {
                text: this.viewModel.newTodo.text(),
                title: this.viewModel.newTodo.title(),
                cssStyle: _styles[random]
            };
            this.viewModel.todos.push(todo);
            this.viewModel.newTodo.text = '';
            this.viewModel.newTodo.title = '';
            this.todoService.put(todo);
        },
        require: ['todo-service']
    };

});