pz.defineStatic('events', function () {
    var _subscriptions = {};
    var _hasOwn = _subscriptions.hasOwnProperty;

    return {
        subscribe: function(name, listener) {
            var index;

            if(!_hasOwn.call(_subscriptions, name)) {
                _subscriptions[name] = [];
            };

            index = _subscriptions[name].push(listener) -1;

            return {
                remove: function() {
                    delete _subscriptions[name][index];
                }
            };
        },
        publish: function(name, args) {

            if(!_hasOwn.call(_subscriptions, name)) {
                return;
            };

            _subscriptions[name].forEach(function(item) {
                item((args != undefined ? args : null));
            });
        }
    };

}, 'pz');
