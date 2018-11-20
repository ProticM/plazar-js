pz.base = function () {

};

pz.base.prototype.mixins = [],
pz.base.prototype.init = function () { },
pz.base.prototype.destroy = function () {
    // TODO: multiple instances destroy
    var idx = pz.application.instances.indexOf(this);
    if (idx != -1) {
        pz.application.instances.splice(idx, 1);
    };
},
pz.base.prototype.applyMixins = function () {
    var me = this;
    pz.forEach(this.mixins, function (mixinName) {
        var mixin = pz.getDefinitionOf(mixinName);
        var cleanMixin = pz.assignTo({}, mixin);
        delete cleanMixin.ownerType;
        pz.assignTo(me, cleanMixin, false);
    });
};
pz.base.prototype.setRequiredInstances = function () {
    var requireDefined = !pz.isEmpty(this.require) &&
        pz.isArray(this.require);

    if (!requireDefined) {
        return;
    };

    pz.forEach(this.require, function (requiredItemType) {
        var instance = pz.getInstanceOf(requiredItemType)
        var requiredItem = pz.isEmpty(instance) ?
            pz.getDefinitionOf(requiredItemType) : instance;
        var camelCaseName = pz.camelize(requiredItemType);

        if (!pz.isEmpty(requiredItem) && pz.isEmpty(this[camelCaseName])) {
            this[camelCaseName] = !pz.isFunction(requiredItem) ? requiredItem :
                pz.create(requiredItemType);
        };
    }, this);
};
pz.base.extend = function extend(props) {
    // TODO: Inherit statics

    var properties = (pz.toObject(props) || {}), parentClass, returnVal;
    if(pz.isEmpty(properties.type)) {
        throw new Error("It seems that you are trying to extend an object without a type defined. Example: mydef.extend({ type: 'my-type' // other configs })");
    };
    parentClass = this;

    returnVal = (function (_parentClass, _properties) {
        var _hasCustomConstructor = _properties && _properties.constructor
            && _properties.constructor !== {}.constructor;
        var propertyNames = Object.keys(_properties);
        var propertiesReduced = propertyNames.reduce(function (acc, key) {
            var isFunction = pz.isFunction(_properties[key]);
            acc[isFunction ? 'fnKeys' : 'attrKeys'].push(key);
            return acc;
        }, { fnKeys: [], attrKeys: [] });

        var pz_type = function () { // child class
            var me = this, result;

            pz.forEach(propertiesReduced.attrKeys, function (key) { // apply properties (strings, ints, arrays, objects...etc) to the object instance
                if (!me.hasOwnProperty(key) && !pz.isEmpty(_properties[key], true)) {
                    var isArray = pz.isArray(_properties[key]);
                    var isObject = pz.isObject(_properties[key]);

                    me[key] = (isArray ? _properties[key].slice() : (isObject ? pz.assignTo({}, _properties[key]) : _properties[key]));
                };
            });
            
            this.ownerType = this.ownerType || _parentClass.$type || 'base';
            this.base = _hasCustomConstructor ? _parentClass : null;
            result = _hasCustomConstructor ? _properties.constructor.apply(this, arguments)
                : _parentClass.apply(this, arguments);
            this.base = null;
            return result || me;
        };

        pz_type.prototype = Object.create(_parentClass.prototype);
        pz_type.prototype.constructor = pz_type;

        pz.forEach(propertiesReduced.fnKeys, function (key) {
            pz_type.prototype[key] = key == 'constructor' ? pz_type.prototype.constructor : (function (name, fn, base) { // share the functions between instances via prototype
                return function () {
                    var tmp = this.base;
                    var addSuperCallWrapper = !pz.isEmpty(base[name]) && pz.isFunction(base[name]);
                    this.base = addSuperCallWrapper ? base[name] : function () {
                        throw new Error('Method named: [' + name + '] was not found on type: [' + this.ownerType + ']');
                    };
                    var result = fn.apply(this, arguments);
                    this.base = tmp;
                    return result;
                };
            })(key, _properties[key], _parentClass.prototype);
        });

        pz_type.extend = extend;
        pz_type.create = (function(t) {
			return function create() {
				var instance = new t();

				instance.id = pz.guid();
                instance.autoLoad = !pz.isEmpty(t.autoLoad) ? t.autoLoad : instance.autoLoad;
                delete t.autoLoad;
                
				if (pz.isComponent(instance) || pz.isClass(instance)) {
					instance.applyMixins();

					if (instance.autoLoad) {
						instance.load();
					};
                };

				return instance;
			}
        })(pz_type);
        pz_type.$isPz = true;
        pz_type.$type = _properties.type;
        return pz_type;

    })(parentClass, properties);

    properties = null;
    parentClass = null;

    return returnVal;
};