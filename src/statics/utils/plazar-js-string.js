plz.defineStatic('str', function () {
    'use strict';

    return {
        camelize: function (str) {
            if (plz.isEmpty(str)) {
                return '';
            };

            return str.replace(/^([A-Z])|[\s-_](\w)/g, function (match, p1, p2, offset) {
                if (p2) return p2.toUpperCase();
                return p1.toLowerCase();
            });
        },

        capitalize: function (str) {
            if (plz.isEmpty(str)) {
                return '';
            };

            var result = str.charAt(0).toUpperCase() + str.substr(1);
            return result || '';
        },

        contains: function (str, value) {
            return plz.isEmpty(str) || plz.isEmpty(value) ? false :
                str.indexOf(value) != -1;
        },

        format: function () {
            var args = Array.prototype.slice.call(arguments);
            var baseString = args[0];
            var params = args.splice(1), result = '';

            if (plz.isEmpty(baseString) || plz.isEmpty(params)) {
                return result;
            };

            plz.forEach(params, function (param, idx) {
                result = plz.isEmpty(result) ? baseString.replace('{' + idx + '}', param) :
                    result.replace('{' + idx + '}', param);
            });

            return result;
        }
    };

}, 'plz');

