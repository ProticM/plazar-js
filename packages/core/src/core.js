const _const = {
    moduleTypes: {
        class: 'class',
        component: 'component',
        mixin: 'mixin'
    },
    types: {
        array: '[object Array]',
        object: '[object Object]',
        fn: '[object Function]',
        string: '[object String]',
        nodeList: '[object NodeList]'
    },
    typeNotFound: 'Type [{0}] was not found within definitions. INFO: In modular environment definitions and instances are not stored globally.',
    typeMustBeStringOrObject: 'First parameter can be string or object.',
    canNotCreate: 'Cannot create an instance based on provided arguments. Example invocation: pz.create({ // config }) or pz.create(\'my-type\')',
    canNotDefine: 'Cannot define type based on provided arguments. Example invocation: pz.define(\'my-type\', { // config })',
    defaultNamespace: 'pz',
    pluginInvalid: 'Please provide a valid plugin. The value you have provided is an empty string, undefined or null.',
    pluginInitFnMissing: 'The plugin you have provided is missing its [init] function. Each plugin must have this since it is going to be called from the framework core.'
};

function _find(array, fn, scope) {
    let i = 0, len = array.length;
    for (; i < len; i++) {
        if (fn.call(scope || array, array[i], i)) {
            return array[i];
        };
    };
    return null;
};

function _invokeIfExists(functionName, namespace) {
    if (pz.isEmpty(namespace)) {
        return;
    };

    if (pz.isFunction(namespace[functionName])) {
        let fn = namespace[functionName];
        return fn.call(namespace);
    };
};

function _get(me, typeOrIdOrAlias, instance, all) {
    let i = pz.isEmpty(instance) ? false : instance,
        sourceArray,
        fnCallback = function (item) {
            return i && (item.id == typeOrIdOrAlias || item.type == typeOrIdOrAlias) ||
                item.type == typeOrIdOrAlias || (!pz.isEmpty(item.alias) && item.alias == typeOrIdOrAlias)
        }, result;

    sourceArray = (i ? me.application.instances : me.definitions);
    result = all ? sourceArray.filter(fnCallback) : me.find(fnCallback, sourceArray);
    fnCallback = null;
    sourceArray = null;
    return result;
};

function _getObjectByNamespaceString(namespace) {
    let parts = namespace.split('.');
    let globalScope = pz.getGlobal();

    if (parts.length == 1) {
        return globalScope[namespace];
    };

    return parts.reduce(function (previous, current) {
        if (pz.isString(previous)) {
            return globalScope[previous][current];
        };

        return previous[current];
    });
};

const pz = {
    definitions: [],
    application: {
        instances: []
    },
    define: function (type, object) {

        let cls, obj, tBase,
            isMixin;
    
        if (pz.isEmpty(type) || pz.isEmpty(object)) {
            throw new Error(_const.canNotDefine);
        };
    
        obj = pz.toObject(object);
        obj.ownerType = pz.isEmpty(obj.ownerType) ? 'base' : obj.ownerType;
        tBase = (this[obj.ownerType] || this.getDefinitionOf(obj.ownerType));
        isMixin = pz.isMixin(obj);
        obj.type = type;
        cls = isMixin ? pz.assignTo(obj, pz.assignTo({}, tBase.prototype), false) :
            tBase.extend(obj);
            
        if(!pz.isModularEnv()) {
            this.storeDefinition(type, cls);
        };
    
        return cls;
    },
    create: function (config) {
        let isObject, type, item;
    
        if (pz.isEmpty(config)) {
            throw new Error(_const.canNotCreate);
        };
    
        isObject = pz.isObject(config);
        type = isObject ? config.type : config;
        item = this.getDefinitionOf(type);
        return item.create((isObject ? config : undefined));
    },
    assignTo: function(target, source, clone) { 

        let assign = function(target) {
    
            if (pz.isEmpty(target)) {
                throw new TypeError(_const.canNotConvertNullOrEmptyObj);
            };
    
            let to = Object(target);
    
            for (let index = 1; index < arguments.length; index++) {
                let nextSource = arguments[index];
    
                if (!pz.isEmpty(nextSource)) {
                    for (let nextKey in nextSource) {
                        if(pz.isObject(nextSource[nextKey])) {
                            to[nextKey] = assign({}, nextSource[nextKey]);
                        } else if(pz.isArray(nextSource[nextKey])) {
                            to[nextKey] = pz.deepClone(nextSource[nextKey]);
                        } else if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                            to[nextKey] = nextSource[nextKey];
                        };
                    };
                };
            };
            return to;
        };
    
        let c = pz.isEmpty(clone) ? true : clone;
        let t = c ? assign({}, target) : target, result;
        result = assign(t, source);
        assign = null;
        return result;
    },
    toObject: (obj, instantiate) => {
        let i = pz.isEmpty(instantiate) ? false : instantiate;
        return pz.isFunction(obj) ? (i ? new obj() : obj()) : obj;
    },
    toFunction: (obj) => {
        let fn = function () { this.constructor = obj.constructor };
        fn.prototype = obj;
        return pz.isFunction(obj) ? obj : fn;
    },
    isTypeOf: (variable, type) => {
        return Object.prototype.toString.call(variable) === type;
    },
    isArray: ('isArray' in Array) ? Array.isArray : (variable) => {
        return pz.isTypeOf(variable, _const.types.array);
    },
    isObject: (variable) => {
        return pz.isTypeOf(variable, _const.types.object);
    },
    isFunction: (variable) => {
        return pz.isTypeOf(variable, _const.types.fn);
    },
    isString: (variable) => {
        return pz.isTypeOf(variable, _const.types.string);
    },
    isNodeList: (variable) => {
        return pz.isTypeOf(variable, _const.types.nodeList);
    },
    isEmpty: (value, allowEmptyStringOrEmptyArrayOrEmptyObject) => {
        return ((!allowEmptyStringOrEmptyArrayOrEmptyObject ? (value == null || value == {}) : false)) ||
            (!allowEmptyStringOrEmptyArrayOrEmptyObject ? value === '' : false)
                || ((pz.isArray(value) || pz.isNodeList(value)) &&
                    (!allowEmptyStringOrEmptyArrayOrEmptyObject ? value.length === 0 : false));
    },
    is: (obj, ownerType) => {
        return !pz.isEmpty(obj) &&
            !pz.isEmpty(obj.ownerType) &&
            obj.ownerType == ownerType;
    },
    isComponent: (obj) => {
        return pz.is(obj, _const.moduleTypes.component) ||
            obj.isComponentInstance == true;
    },
    isMixin: (obj) => {
        return pz.is(obj, _const.moduleTypes.mixin);
    },
    isClass: (obj) => {
        return pz.is(obj, _const.moduleTypes.class);
    },
    isInstanceOf: (variable, type) => {
        return variable instanceof type;
    },
    forEach: (subject, fn, scope) => {
        let length = (pz.isEmpty(subject) ? 0 : subject.length), i = 0;
        for (; i < length; i++) {
            let result = fn.call(scope || subject[i], subject[i], i, subject);
            if (result == false) {
                return result;
            };
        };
        fn = null;
    },
    proxy: function(fn, context) {
        let args;
    
        if (!pz.isFunction(fn)) {
            return;
        };
    
        args = Array.prototype.slice.call(arguments, 2);
        return function() {
            return fn.apply(context || this, args.concat(Array.prototype.slice.call(arguments)));
        };
    },
    guid: () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },
    toJSON: (value, safe, asString) => {
        let json, asStr = asString || false;
        try {
            json = asStr ? JSON.stringify(value) :
                JSON.parse(value);
        } catch (e) {
            if (!safe) {
                throw new Error(e);
            };
        };
        return json;
    },
    getGlobal: () => {
        return (typeof window !== 'undefined' ? window : global);
    },
    isPzDefinition: (value) => {
        return pz.isFunction(value) && value.$isPz;
    },
    deepClone: (value) => {
        let result = pz.isInstanceOf(value, Array) ? [] : {}, i;
    
        for (i in value) {
            result[i] = (pz.isObject(value[i]) ? 
                pz.deepClone(value[i]) : value[i]);
        };
    
        return result;
    },
    isModularEnv: () => {
        return (typeof exports === 'object' && typeof module !== 'undefined') || 
            (typeof define === 'function' && !pz.isEmpty(define.amd));
    },
    storeDefinition: function(type, definition) {
        this.definitions.push({
            type: type,
            definition: definition
        });
    },
    ns: (namespace, config) => {
        let names = namespace.split('.');
        let parent = pz.getGlobal(), current = '';
        for (let i = 0, len = names.length; i < len; i++) {
            current = names[i];
            parent[current] = parent[current] || {};
            parent = parent[current];
        };
    },
    defineStatic: function (type, object, namespace) {

        let obj = pz.toObject(object);
        let ns = (pz.isEmpty(namespace) ? 'statics' : namespace);
        let isDefault = (ns == _const.defaultNamespace);
        let globalScope = pz.getGlobal();
    
        if (pz.isEmpty(globalScope[ns]) && !isDefault) {
            this.ns(ns);
        };
    
        let o = (isDefault ? this : _getObjectByNamespaceString(ns));
        if (pz.isEmpty(type)) {
            pz.assignTo(o, obj, false);
        } else {
            o[type] = obj;
        };
    },
    defineApplication: function (config) {
        let rootComponents = !pz.isEmpty(config.components) && pz.isArray(config.components) ? 
            config.components : [], globalScope = pz.getGlobal();
        delete config.components;
        delete config.instances;
        _invokeIfExists('preInit', config);

        pz.assignTo(this.application, config);
    
        if (pz.isEmpty(globalScope[config.namespace])) {
            this.ns(config.namespace, config);
            pz.assignTo(globalScope[config.namespace], config, false);
        } else {
            pz.assignTo(globalScope[config.namespace], config, false);
        };
        
        pz.forEach(rootComponents, function (item) {
            let def = (pz.isPzDefinition(item) ? item : pz.getDefinitionOf(item));
            if (pz.isFunction(def.create)) {
                def.create();
            };
        });
    
        _invokeIfExists('init', config);
    },
    find: (callback, arr, scope) => {
        let findFnSupported = ('find' in Array.prototype); // find is not supported in IE
        let res = findFnSupported ? arr.find(callback, scope) :
            _find(arr, callback, scope);
        callback = null;
        return res;
    },
    getDefinitionOf: function (type) {
        let item = _get(this, type);
    
        if (pz.isEmpty(item)) {
            let msg = _const.typeNotFound.replace('{0}', type);
            throw new Error(msg);
        };
    
        return item.definition;
    },
    getInstanceOf: function (typeOrIdOrAlias, all) {
        return _get(this, typeOrIdOrAlias, true, all);
    },
    plugin: function(value) {
        
        if(pz.isEmpty(value)) {
            throw new Error(_const.pluginInvalid);
        };

        if(!pz.isFunction(value.init)) {
            throw new Error(_const.pluginInitFnMissing);
        };

        return value.init(pz);
    }
};

export default pz;
