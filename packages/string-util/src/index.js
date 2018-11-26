const stringUtil = {
    camelize: (str) => {
        return pz.camelize(str);
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

    format: () =>  {
        return pz.format.apply(pz, arguments);
    }
};

export default stringUtil;