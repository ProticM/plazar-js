import pz from '../core';

const stringUtil = {
    camelize: (str) => {
        if (pz.isEmpty(str)) {
            return '';
        };
    
        return str.replace(/^([A-Z])|[\s-_](\w)/g, function (match, p1, p2, offset) {
            if (p2) return p2.toUpperCase();
            return p1.toLowerCase();
        });
    },

    capitalize: (str) => {
        if (pz.isEmpty(str)) {
            return '';
        };

        let result = str.charAt(0).toUpperCase() + str.substr(1);
        return result || '';
    },

    contains: (str, value) => {
        return pz.isEmpty(str) || pz.isEmpty(value) ? false :
            str.indexOf(value) != -1;
    },

    format: function() {
        let args = Array.prototype.slice.call(arguments);
        let baseString = args[0];
        let params = args.splice(1), result = '';
    
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

export default stringUtil;