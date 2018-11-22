return {
    clear: function (array) {
        if (pz.isEmpty(array)) {
            return;
        };

        array.splice(0, array.length);
    },

    find: function (callback, arr, scope) {
        return pz.find(callback, arr, scope);
    },

    contains: function (array, item, fromIndex) {
        var isFunction = pz.isFunction(item);

        return isFunction ? (function () {
            var el = pz.arr.find(item, array);
            return !pz.isEmpty(el);
        })() : pz.isEmpty(array) ? false : array.indexOf(item, fromIndex) != -1;
    },

    filter: function (callback, array) {
        var res = array.filter(callback);
        callback = null;
        return res;
    },

    merge: function () {
        var args = Array.prototype.slice.call(arguments),
            resultArray = [];

        pz.forEach(args, function (array) {
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
        if (pz.isEmpty(array) || pz.isEmpty(index)) {
            return;
        };

        array.splice(index, 1);
    }
};