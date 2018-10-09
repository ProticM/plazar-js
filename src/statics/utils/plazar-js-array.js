plz.defineStatic('arr', function () {
    'use strict';

    return {
        clear: function (array) {
            if (plz.isEmpty(array)) {
                return;
            };

            array.splice(0, array.length);
        },

        find: function (callback, arr, scope) {
            return plz.find(callback, arr, scope);
        },

        contains: function (array, item, fromIndex) {
            var isFunction = plz.isFunction(item);

            return isFunction ? (function () {
                var el = plz.arr.find(item, array);
                return !plz.isEmpty(el);
            })() : plz.isEmpty(array) ? false : array.indexOf(item, fromIndex) != -1;
        },

        filter: function (callback, array) {
            var res = array.filter(callback);
            callback = null;
            return res;
        },

        merge: function () {
            var args = Array.prototype.slice.call(arguments),
                resultArray = [];

            plz.forEach(args, function (array) {
                resultArray = resultArray.concat(array);
            });

            return resultArray;
        },

        map: function (callback, array, scope) {
            var result = array.map(callback, scope);
            callback = null;
            return result;
        },

        removeAt: function (array, index) {
            if (plz.isEmpty(array) || plz.isEmpty(index)) {
                return;
            };

            array.splice(index, 1);
        },
    };

}, 'plz');
