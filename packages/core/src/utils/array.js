import pz from '../core';

const arr = {
	clear: (array) => {
		if (pz.isEmpty(array)) {
			return;
		}

		return array.splice(0, array.length);
	},

	find: (callback, arr, scope) => {
		return pz.find(callback, arr, scope);
	},

	contains: (array, item, fromIndex) => {
		let isFunction = pz.isFunction(item);

		return isFunction ? (() => {
			let el = pz.arr.find(item, array);
			return !pz.isEmpty(el);
		})() : pz.isEmpty(array) ? false : array.indexOf(item, fromIndex) != -1;
	},

	filter: (callback, array) => {
		let res = array.filter(callback);
		callback = null;
		return res;
	},

	merge: function () {
		let args = Array.prototype.slice.call(arguments),
			resultArray = [];

		pz.forEach(args, (array) => {
			resultArray = resultArray.concat(array);
		});

		return resultArray;
	},

	map: (callback, array, scope) => {
		let result = array.map(callback, scope);
		callback = null;
		return result;
	},

	removeAt: (array, index) => {
		if (pz.isEmpty(array) || pz.isEmpty(index)) {
			return;
		}

		array.splice(index, 1);
	}
};

export default arr;