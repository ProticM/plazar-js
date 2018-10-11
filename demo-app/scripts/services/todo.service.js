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
            _todos.push(todo);
        },
        delete: function(idx) {
            plz.arr.removeAt(_todos, idx);
        },
        clear: function(idx) {
            plz.arr.clear(_todos);
        }
    }
});