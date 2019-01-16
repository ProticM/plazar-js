import pz from '../../core';
import observable from './observable';
//observe and observableArray will throw a circular reference error if they get separated as modules

let observe = function (value) {

	if (!pz.isObject(value) || value.$observed) {
		return false;
	}

	let properties = Object.keys(value);

	pz.forEach(properties, function (prop) {

		let propValue = value[prop];
		let obsArray = observeArray(value, propValue, prop);

		if (!obsArray && !pz.isInstanceOf(value, observable) && !observe(propValue) &&
			!pz.isFunction(propValue)) {
			observable.create(value, prop);
		}
	});

	value.$observed = true;
	return true;
};

let observeArray = function (obj, collection, prop) {

	let isArray = pz.isArray(collection);
	let obsArray;

	if (!isArray) {
		return obsArray;
	}

	obsArray = new observableArray(obj, collection, prop);
	pz.forEach(obsArray, function (item) {
		observe(item);
	});

	return obsArray;
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
		}

		let length = this.length;
		let me = this;
		this.hasData = length > 0;

		Object.defineProperty(this, 'length', {
			configurable: false,
			enumerable: true,
			set: function (newValue) {
				let newItem;

				if (newValue > length) { // push or unshift
					newItem = this.$action == 'push' ? this[length] : this[0];
					observe(newItem);
				}

				if (newValue != length) {
					length = newValue;
					this.hasData = length > 0;
				}
			},
			get: function () {
				return length;
			}
		});

		delete obj[prop];
		Object.defineProperty(obj, prop, {
			configurable: true,
			enumerable: true,
			get: function () {
				return me;
			},
			set: function (newValue) {
				let shouldNotify = me.length != newValue.length,
					newLength = newValue.length,
					last = newLength - 1;

				if (shouldNotify) {
					me.$pauseNotify = true;
					me.removeAll();

					pz.forEach(newValue, (item, index) => {
						me.$pauseNotify = (index != last);
						me.push(item);
					});

					delete me.$pauseNotify;

					if (newLength == 0) { me.removeAll(); } // trigger UI update
				}
			}
		});

		observable.create(this, 'hasData');
		return this;
	}
}

observableArray.prototype = [];

pz.forEach(observableMethods, function (methodName) {

	let method = arrPrototype[methodName];

	observableArray.prototype[methodName] = function () {
		this.$action = methodName;
		let returnValue = method.apply(this, arguments);

		let subscription = pz.find(function (subscription) {
			return subscription.name == methodName;
		}, this.subscriptions);

		if (subscription && !this.$pauseNotify) {
			let args = arrPrototype.slice.call(arguments);
			subscription.callback.apply(this, args);
		}

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
	}

	return this[index];
};

observableArray.prototype.removeAll = function () {
	return this.splice(0, this.length);
};

export {
	observe,
	observableArray
};