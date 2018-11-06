pz.define('todo-service', function() {

    var _todos = [{
        id: 1,
        title: 'Kids',
        text: 'Pick up kids from kindergarten',
        isCompleted: true
    }, {
        id: 2,
        title: 'Happy wife',
        text: 'Buy flowers',
        isCompleted: false
    }];

    var _get = function(isCompleted) {
        return pz.arr.filter(function(todo) {
            return (isCompleted == todo.isCompleted) ? true : false;
        }, _todos);
    };

    return {
        ownerType: 'class',
        get: function() {
            return _todos;
        },
        put: function(todo) {
            var json = pz.binder.toJSON(todo);
            _todos.push(json);
        },
        delete: function(idx) {
            pz.arr.removeAt(_todos, idx);
        },
        clear: function() {
            pz.arr.clear(_todos);
        },
        update: function(todo) {
            var jTodo = pz.binder.toJSON(todo);
            pz.arr.find(function(item) {
                return item.id == jTodo.id;
            }, _todos).isCompleted = jTodo.isCompleted;
        },
        getCompleted: function() {
            return _get(true);
        },
        getUnCompleted: function() {
            return _get(false);
        }
    }
});