import pz from '../core';

class base {
    init() { };
    destroy() {
        let idx = pz.application.instances.indexOf(this);
        if (idx != -1) {
            pz.application.instances.splice(idx, 1);
        };
    };
    applyMixins() {
        let me = this;
        pz.forEach(this.mixins, function (m) {
            let mixin = pz.isMixin(m) ? m : pz.getDefinitionOf(m);
            let cleanMixin = pz.assignTo({}, mixin);
            delete cleanMixin.ownerType;
            delete cleanMixin.type;
            pz.assignTo(me, cleanMixin, false);
        });
    };
    setRequiredInstances() {
        let isModularEnv = pz.isModularEnv();
        let requireDefined = !pz.isEmpty(this.require) &&
            pz.isArray(this.require);
    
        if (isModularEnv || !requireDefined) {
            return;
        };
    
        pz.forEach(this.require, function (requiredItemType) {
            let instance = pz.getInstanceOf(requiredItemType)
            let requiredItem = pz.isEmpty(instance) ?
                pz.getDefinitionOf(requiredItemType) : instance;
            let camelCaseName = pz.str.camelize(requiredItemType);
    
            if (!pz.isEmpty(requiredItem) && pz.isEmpty(this[camelCaseName])) {
                this[camelCaseName] = !pz.isFunction(requiredItem) ? requiredItem :
                    pz.create(requiredItemType);
            };
        }, this);
    };
};

base.extend = function extend(props) {
    // TODO: Inherit statics

    let properties = (pz.toObject(props) || {}), parentClass, returnVal;
    if(pz.isEmpty(properties.type)) {
        throw new Error("It seems that you are trying to create an object without a type definition. Example invocation: myDefinition.extend({ type: 'my-type' // other configs });");
    };
    parentClass = this;

    returnVal = (function (_parentClass, _properties) {
        let _hasCustomConstructor = _properties && _properties.constructor
            && _properties.constructor !== {}.constructor;
        let propertyNames = Object.keys(_properties);
        let propertiesReduced = propertyNames.reduce(function (acc, key) {
            let isFunction = pz.isFunction(_properties[key]);
            acc[isFunction ? 'fnKeys' : 'attrKeys'].push(key);
            return acc;
        }, { fnKeys: [], attrKeys: [] });

        let pz_type = function () { // child class
            let me = this, result;
            pz.forEach(propertiesReduced.attrKeys, function (key) { // apply properties (strings, ints, arrays, objects...etc) to the object instance
                if (!me.hasOwnProperty(key) && !pz.isEmpty(_properties[key], true)) {
                    let isArray = pz.isArray(_properties[key]);
                    let isObject = pz.isObject(_properties[key]);

                    me[key] = (isArray ? pz.deepClone(_properties[key]) : (isObject ? pz.assignTo({}, _properties[key]) : _properties[key]));
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
                    let tmp = this.base;
                    let addSuperCallWrapper = !pz.isEmpty(base[name]) && pz.isFunction(base[name]);
                    this.base = addSuperCallWrapper ? base[name] : function () {
                        throw new Error('Method named: [' + name + '] was not found on type: [' + this.ownerType + ']');
                    };
                    let result = fn.apply(this, arguments);
                    this.base = tmp;
                    return result;
                };
            })(key, _properties[key], _parentClass.prototype);
        });

        pz_type.extend = extend;
        pz_type.create = (function(t) {
			return function create(config) {
                let params, instance;

                if(!pz.isEmpty(config)) {
                    params = pz.assignTo({}, config, false);
                    delete params.type;
                    delete config.type;
				    instance = new t(params);
                    pz.assignTo(instance, config, false);
                } else {
                    instance = new t();
                };

				instance.id = pz.guid();
                instance.autoLoad = !pz.isEmpty(t.autoLoad) ? t.autoLoad : instance.autoLoad;
                delete t.autoLoad;
                instance.setRequiredInstances();

				if (pz.isComponent(instance) || pz.isClass(instance)) {
					instance.applyMixins();

					if (instance.autoLoad) {
						instance.load();
					};
                };
                
                if(!pz.isModularEnv()) {
                    pz.application.instances.push(instance);
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

export default base;