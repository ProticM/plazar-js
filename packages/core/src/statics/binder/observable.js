import pz from '../../core';

let defineReactive = function (me, obj, key) {
    let value = obj[key];

    delete obj[key];
    Object.defineProperty(obj, key, {
        configurable: true,
        enumerable: true,
        set: function (newValue) {
            let val = newValue.value != null || newValue.value != undefined ? newValue.value : newValue;
            let shouldNotify = val != value && me.notify != undefined;
            value = val;
            if (shouldNotify) {
                me.notify();
            };
        },
        get: function () {
            let get = function () {
                return value;
            };

            get.subscribe = function (callback, bindingId) {
                me.subscribe.call(me, callback, bindingId);
            };

            get.unsubscribe = function (bindingId) {
                me.unsubscribe.call(me, bindingId);
            };

            return get;
        }
    });
};

class observable {
    constructor(obj, key) {
        this.value = obj[key];
        this.prop = key;
        this.subscriptions = [];
        defineReactive(this, obj, key);
        return this;
    };
    notify() {
        if (this.subscriptions.length == 0) {
            return;
        };
    
        pz.forEach(this.subscriptions, function (subscription) {
            subscription.update.call(this, subscription);
        }, this);
    };
    subscribe(callback, bindingId) {
        let length = this.subscriptions.length;
        this.subscriptions.push({
            id: bindingId || length++,
            update: callback
        });
    };
    unsubscribe(bindingId) {
        let bindingSubs = this.subscriptions.filter(function (sub) {
            return sub.id == bindingId;
        });
    
        pz.forEach(bindingSubs, function (sub) {
            let idx = this.subscriptions.indexOf(sub);
            this.subscriptions.splice(idx, 1);
        }, this);
    };
};

export default observable;