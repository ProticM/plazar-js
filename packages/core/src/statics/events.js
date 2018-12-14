const events = () => {
    let _subscriptions = {};
    let _hasOwn = _subscriptions.hasOwnProperty;

    return {
        subscribe: (name, listener) => {
            let index;

            if(!_hasOwn.call(_subscriptions, name)) {
                _subscriptions[name] = [];
            };

            index = _subscriptions[name].push(listener) -1;

            return {
                remove: () => {
                    delete _subscriptions[name][index];
                }
            };
        },
        publish: (name, args) => {

            if(!_hasOwn.call(_subscriptions, name)) {
                return;
            };

            _subscriptions[name].forEach((subscription) => {
                subscription((args != undefined ? args : null));
            });
        }
    };

};

export default events;