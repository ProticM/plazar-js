const objectUtil = {
    assignTo: (target, source, clone) => {
        return pz.assignTo(target, source, clone);
    },

    clone: function (obj) {
        return this.assignTo({}, obj);
    },

    getKeys: Object.keys, // create polyfill?

    getValues: (obj) => {

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

export default objectUtil;