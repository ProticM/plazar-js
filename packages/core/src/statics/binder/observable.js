import pz from '../../core';

class observable {
    _defineReactive(obj, key) {
        let me = this;

        delete obj[key];
        Object.defineProperty(obj, key, {
            configurable: true,
            enumerable: true,
            set: function (newValue) {
                let val = newValue.value != null || newValue.value != undefined ? newValue.value : newValue;
                let shouldNotify = val != me.value && me.notify != undefined;
                me.value = val;
                if (shouldNotify) {
                    me.notify();
                };
            },
            get: function () {
                let get = () => {
                    return me.value;
                };
    
                get.subscribe = (callback, bindingId) => {
                    me.subscribe.call(me, callback, bindingId);
                };
    
                get.unsubscribe = (bindingId) => {
                    me.unsubscribe.call(me, bindingId);
                };
    
                return get;
            }
        });
    };
    constructor(obj, key) {
        this.value = obj[key];
        this.prop = key;
        this.subscriptions = [];
        this._defineReactive(obj, key);
        return this;
    };
    notify() {
        if (this.subscriptions.length == 0) {
            return;
        };
    
        pz.forEach(this.subscriptions, function (subscription) {
            subscription.update.call(this, this.value);
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
    static create(obj, key) {
        return new observable(obj, key);
    }
};

export default observable;