pz.defineStatic('str', function () {
    'use strict';

    return {
        camelize: function (str) {
            return pz.camelize(str);
        },

        capitalize: function (str) {
            if (pz.isEmpty(str)) {
                return '';
            };

            var result = str.charAt(0).toUpperCase() + str.substr(1);
            return result || '';
        },

        contains: function (str, value) {
            return pz.isEmpty(str) || pz.isEmpty(value) ? false :
                str.indexOf(value) != -1;
        },

        format: function () {
            var args = Array.prototype.slice.call(arguments);
            var baseString = args[0];
            var params = args.splice(1), result = '';

            if (pz.isEmpty(baseString) || pz.isEmpty(params)) {
                return result;
            };

            pz.forEach(params, function (param, idx) {
                result = pz.isEmpty(result) ? baseString.replace('{' + idx + '}', param) :
                    result.replace('{' + idx + '}', param);
            });

            return result;
        }
    };

}, 'pz');

