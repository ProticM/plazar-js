plz.defineStatic('obj', function () {
    'use strict';

    var _const = {
        canNotConvertNullOrEmptyObj: 'Cannot convert undefined or null to object'
    };

    return {

        assignTo: function (target, source, clone) {
            return plz.assignTo(target, source, clone);
        },

        clone: function (obj) {
            return this.assignTo({}, obj);
        },

        getKeys: Object.keys,

        getValues: function (obj) {

            var vals = [], prop,
                valuesSupported = ('values' in Object);

            if (valuesSupported) {
                return Object.values(obj);
            };

            for (prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    vals.push(obj[prop]);
                };
            };

            return vals;
        }
    };

}, 'plz');
