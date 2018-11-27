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

        var result = str.charAt(0).toUpperCase() + str.substr(1);
        return result || '';
    },

    contains: (str, value) => {
        return pz.isEmpty(str) || pz.isEmpty(value) ? false :
            str.indexOf(value) != -1;
    },

    function: () => {
        var args = Array.prototype.slice.call(arguments);
        var baseString = args[0];
        var params = args.splice(1), result = '';
    
        if (_isEmpty(baseString) || _isEmpty(params)) {
            return result;
        };
    
        _forEach(params, function (param, idx) {
            result = _isEmpty(result) ? baseString.replace('{' + idx + '}', param) :
                result.replace('{' + idx + '}', param);
        });
    
        return result;
    }
};

export default stringUtil;