import pz from '../../core';

let observe = function (value) {

    if (!pz.isObject(value) || value.$observed) {
        return false;
    };

    let properties = Object.keys(value);

    pz.forEach(properties, function (prop) {

        let propValue = value[prop];

        let obsArray = observeArray(value, propValue, prop);

        if (obsArray && !pz.isInstanceOf(value, observableArray)) {
            value[prop] = obsArray;
        };

        if (!obsArray && !pz.isInstanceOf(value, observable) && !observe(propValue) &&
            !pz.isFunction(propValue)) {
            value[prop] = new observable(value, prop);
        };
    });

    value.$observed = true;
    return true;
};

let observeArray = function (obj, collection, prop) {

    let isArray = pz.isArray(collection);
    let obsArray;

    if (!isArray) {
        return obsArray;
    };

    obsArray = new observableArray(obj, collection, prop);
    pz.forEach(obsArray, function (item) {
        observe(item);
    });

    return obsArray;
};

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
};

observable.prototype.notify = function () {
    if (this.subscriptions.length == 0) {
        return;
    };

    pz.forEach(this.subscriptions, function (subscription) {
        subscription.update.call(this, subscription);
    }, this);
};

observable.prototype.subscribe = function (callback, bindingId) {
    let length = this.subscriptions.length;
    this.subscriptions.push({
        id: bindingId || length++,
        update: callback
    });
};

observable.prototype.unsubscribe = function (bindingId) {
    let bindingSubs = this.subscriptions.filter(function (sub) {
        return sub.id == bindingId;
    });

    pz.forEach(bindingSubs, function (sub) {
        let idx = this.subscriptions.indexOf(sub);
        this.subscriptions.splice(idx, 1);
    }, this);
};

let observableMethods = 'pop push shift unshift splice reverse sort'.split(' '),
    normalMethods = 'slice concat join some every forEach map filter reduce reduceRight indexOf lastIndexOf toString toLocaleString'.split(' '),
    arrPrototype = Array.prototype;

class observableArray {
    constructor(obj, collection, prop) {
        collection = collection || [];

        this.subscriptions = [];
        this.prop = prop;

        for (let i = 0; i < collection.length; i++) {
            this.push(collection[i]);
        };

        let length = this.length;
        this.hasData = length > 0;

        Object.defineProperty(this, 'length', {
            configurable: false,
            enumerable: true,
            set: function (newValue) {
                let newItem;

                if (newValue > length) { // push or unshift
                    newItem = this.$action == 'push' ? this[length] : this[0];
                    observe(newItem);
                };

                if (newValue != length) {
                    length = newValue;
                    this.hasData = length > 0;
                };
            },
            get: function () {
                return length;
            }
        });

        this.hasData = new observable(this, 'hasData');
        return this;
    };
};

observableArray.prototype = [];

pz.forEach(observableMethods, function (methodName) {

    let method = arrPrototype[methodName];

    observableArray.prototype[methodName] = function () {
        this.$action = methodName;
        let returnValue = method.apply(this, arguments);

        let subscription = pz.find(function (subscription) {
            return subscription.name == methodName;
        }, this.subscriptions);

        if (subscription) {
            let args = arrPrototype.slice.call(arguments);
            subscription.callback.apply(this, args);
        };

        delete this.$action;
        return returnValue;
    };
});

pz.forEach(normalMethods, function (methodName) {
    observableArray.prototype[methodName] = arrPrototype[methodName];
});

observableArray.prototype.subscribe = function (callback, bindingId) {
    this.subscriptions.splice(0, this.subscriptions.length);
    pz.forEach(observableMethods, function (method) {
        let length = this.subscriptions.length;
        this.subscriptions.push({
            id: bindingId || length++,
            name: method,
            callback: callback
        });
    }, this);
    callback = null;
};

observableArray.prototype.unsubscribe = function (bindingId) {

    let bindingSubs = this.subscriptions.filter(function (sub) {
        return sub.id == bindingId;
    });

    pz.forEach(bindingSubs, function (sub) {
        let idx = this.subscriptions.indexOf(sub);
        this.subscriptions.splice(idx, 1);
    }, this);
};

observableArray.prototype.getFirst = function () {
    return this.getAt(0);
};

observableArray.prototype.getLast = function () {
    return this.getAt(this.length - 1);
};

observableArray.prototype.getAt = function (index) {

    if (pz.isEmpty(index)) {
        return null;
    };

    return this[index];
};

observableArray.prototype.removeAll = function () {
    this.splice(0, this.length);
};

export {
    observe,
    observable,
    observableArray
};