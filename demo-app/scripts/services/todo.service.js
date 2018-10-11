plz.define('todo-service', function() {

    var _todos = [{
        title: 'Kids',
        text: 'Pick up kids from kindergarten',
        isCompleted: true
    }, {
        title: 'Happy wife',
        text: 'Buy flowers',
        isCompleted: false
    }];

    return {
        ownerType: 'class',
        get: function() {
            return _todos;
        },
        put: function(todo) {
            var json = plz.binder.toJSON(todo);
            _todos.push(json);
        },
        delete: function(idx) {
            plz.arr.removeAt(_todos, idx);
        },
        clear: function(idx) {
            plz.arr.clear(_todos);
        },
        getCompleted: function() {
            return plz.arr.filter(function(todo) {
                return todo.isCompleted;
            }, _todos);
        }
    }
});