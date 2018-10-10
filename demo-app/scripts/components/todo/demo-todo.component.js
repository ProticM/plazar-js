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
        autoLoad: true,
        template: '<div>' +
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
                    '<button class="button is-primary btn-add">Add</button>' + 
                '</div>' +
            '</div>' + 
            '<br />' +
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
            this.base(arguments);
        },
        addTodo: function() {
            var random = Math.floor((Math.random() * (5 - 0) + 0));
            this.viewModel.todos.push({
                text: this.viewModel.newTodo.text(),
                title: this.viewModel.newTodo.title(),
                cssStyle: _styles[random]
            });
        }
    };

});