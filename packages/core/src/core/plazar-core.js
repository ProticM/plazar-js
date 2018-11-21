var pz = {};

var _const = {
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
    typeNotFound: 'Type [{0}] was not found within definitions',
    typeMustBeStringOrObject: 'First parameter can be string or object',
    canNotCreate: 'Can not create an instance based on provided arguments',
    canNotDefine: 'Can not define type based on provided arguments',
    coreBaseTypes: ['base', 'mixin'],
    defaultNamespace: 'pz'
};

var _find = function (array, fn, scope) {
    var i = 0, len = array.length;
    for (; i < len; i++) {
        if (fn.call(scope || array, array[i], i)) {
            return array[i];
        };
    };
    return null;
};

var _assignTo = function (target, source, clone) { 

    var assign = function (target) {

        if (pz.isEmpty(target)) {
            throw new TypeError(_const.canNotConvertNullOrEmptyObj);
        };

        var to = Object(target);

        for (var index = 1; index < arguments.length; index++) {
            var nextSource = arguments[index];

            if (!pz.isEmpty(nextSource)) {
                for (var nextKey in nextSource) {
                    if(pz.isObject(nextSource[nextKey])) {
                        to[nextKey] = assign({}, nextSource[nextKey]);
                    } else if(pz.isArray(nextSource[nextKey])) {
                        to[nextKey] = _deepClone(nextSource[nextKey]);
                    } else if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                        to[nextKey] = nextSource[nextKey];
                    };
                };
            };
        };
        return to;
    };

    var c = pz.isEmpty(clone) ? true : clone;
    var t = c ? assign({}, target) : target, result;
    result = assign(t, source);
    assign = null;
    return result;
};

var _camelize = function (str) {
    if (pz.isEmpty(str)) {
        return '';
    };

    return str.replace(/^([A-Z])|[\s-_](\w)/g, function (match, p1, p2, offset) {
        if (p2) return p2.toUpperCase();
        return p1.toLowerCase();
    });
};

var _format =function () {
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
};

var _define = function (type, object) {

    var cls, obj, tBase,
        isMixin;

    if (pz.isEmpty(type) || pz.isEmpty(object)) {
        throw new Error(_const.canNotDefine);
    };

    obj = pz.toObject(object);
    obj.ownerType = pz.isEmpty(obj.ownerType) ? 'base' : obj.ownerType;
    tBase = (pz[obj.ownerType] || pz.getDefinitionOf(obj.ownerType));
    isMixin = pz.isMixin(obj);
    obj.type = type;
    cls = isMixin ? pz.assignTo(obj, pz.assignTo({}, tBase.prototype), false) :
        tBase.extend(obj);

    this.definitions.push({
        type: type,
        definition: cls
    });

    return cls;
};

var _create = function (config) {
    var isObject, type, item, instance, params;

    if (pz.isEmpty(config)) {
        throw new Error(_const.canNotCreate);
    };

    isObject = pz.isObject(config);
    type = isObject ? config.type : config;
    item = pz.getDefinitionOf(type);
    
    if (isObject) {
        params = _assignTo({}, config, false);
        delete params.type;
        delete config.type;
        instance = new item(params);
        pz.assignTo(instance, config, false);
    } else {
        instance = new item();
    };

    instance.id = pz.guid();
    instance.setRequiredInstances(instance);

    if (pz.isComponent(instance) || pz.isClass(instance)) {
        instance.applyMixins();

        if (instance.autoLoad) {
            instance.load();
        };
    };

    pz.application.instances.push(instance);

    return instance;
};

var _toObject = function (obj, instantiate) {
    var i = _isEmpty(instantiate) ? false : instantiate;
    return _isFunction(obj) ? (i ? new obj() : obj()) : obj;
};

var _toFunction = function (obj) {
    var fn = function () { this.constructor = obj.constructor };
    fn.prototype = obj;
    return _isFunction(obj) ? obj : fn;
};

var _isTypeOf = function (variable, type) {
    return Object.prototype.toString.call(variable) === type;
};

var _isArray = ('isArray' in Array) ? Array.isArray : function (variable) {
    return _isTypeOf(variable, _const.types.array);
};

var _isObject = function (variable) {
    return _isTypeOf(variable, _const.types.object);
};

var _isFunction = function (variable) {
    return _isTypeOf(variable, _const.types.fn);
};

var _isString = function (variable) {
    return _isTypeOf(variable, _const.types.string);
};

var _isNodeList = function (variable) {
    return _isTypeOf(variable, _const.types.nodeList);
};

var _isEmpty = function (value, allowEmptyStringOrEmptyArrayOrEmptyObject) {
    return ((!allowEmptyStringOrEmptyArrayOrEmptyObject ? (value == null || value == {}) : false)) ||
        (!allowEmptyStringOrEmptyArrayOrEmptyObject ? value === '' : false)
            || ((_isArray(value) || _isNodeList(value)) &&
                (!allowEmptyStringOrEmptyArrayOrEmptyObject ? value.length === 0 : false));
};

var _is = function (obj, ownerType) {
    return !_isEmpty(obj) &&
        !_isEmpty(obj.ownerType) &&
        obj.ownerType == ownerType;
};

var _isComponent = function (obj) {
    return _is(obj, _const.moduleTypes.component) ||
        obj.isComponentInstance == true;
};

var _isMixin = function (obj) {
    return _is(obj, _const.moduleTypes.mixin);
};

var _isClass = function (obj) {
    return _is(obj, _const.moduleTypes.class);
};

var _isInstanceOf = function (variable, type) {
    return variable instanceof type;
};

var _forEach = function (subject, fn, scope) {
    var length = (_isEmpty(subject) ? 0 : subject.length), i = 0;
    for (; i < length; i++) {
        var result = fn.call(scope || subject[i], subject[i], i, subject);
        if (result == false) {
            return result;
        };
    };
    fn = null;
};

var _proxy = function (fn, context) {
    var tmp, args, proxy;

    if (_isString(context)) {
        tmp = fn[context];
        context = fn;
        fn = tmp;
    };

    if (!_isFunction(fn)) {
        return;
    };

    args = Array.prototype.slice.call(arguments, 2);
    proxy = function () {
        var c = pz.isComponent(context) && context.destroyed ? 
            pz.getInstanceOf(context.type) : context;
        return fn.apply(c || this, args.concat(Array.prototype.slice.call(arguments)));
    };

    return proxy;
};

var _toJSON = function (value, safe, asString) {
    var json, asStr = asString || false;
    try {
        json = asStr ? JSON.stringify(value) :
            JSON.parse(value);
    } catch (e) {
        if (!safe) {
            throw new Error(e);
        };
    };
    return json;
};

var _guid = function () {
    //GUID reference: https://gist.github.com/evansdiy/4256630

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

var _defineNamespace = function (namespace, config) {
    var names = namespace.split('.');
    var parent = _getGlobal(), current = '';
    for (var i = 0, len = names.length; i < len; i++) {
        current = names[i];
        parent[current] = parent[current] || {};
        parent = parent[current];
    };
};

var _invokeIfExists = function (functionName, namespace) {
    if (_isEmpty(namespace)) {
        return;
    };

    if (_isFunction(namespace[functionName])) {
        var fn = namespace[functionName];
        return fn.call(namespace);
    };
};

var _get = function (me, typeOrIdOrAlias, instance, all) {
    var i = _isEmpty(instance) ? false : instance,
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

var _getObjectByNamespaceString = function (namespace) {
    var parts = namespace.split('.');
    var globalScope = _getGlobal();

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

var _getGlobal = function() {
    return (typeof window !== 'undefined' ? window : global);
};

var _isPzDefinition = function(value) {
    return _isFunction(value) && value.$isPz;
};

var _deepClone = function(value) {
    var result = _isInstanceOf(value, Array) ? [] : {}, i;

    for (i in value) {
        result[i] = (_isObject(value[i]) ? 
            _deepClone(value[i]) : value[i]);
    };

    return result;
};

var _isModularEnv = function() {
    return (typeof exports === 'object' && typeof module !== 'undefined') || 
        (typeof define === 'function' && define.amd);
};

pz.ns = function (name, config) {
    _defineNamespace(name, config || {});
};

pz.defineStatic = function (type, object, namespace) {

    var obj = _toObject(object);
    var ns = (_isEmpty(namespace) ? 'statics' : namespace);
    var isDefault = (ns == _const.defaultNamespace);
    var globalScope = _getGlobal();

    if (_isEmpty(globalScope[ns]) && !isDefault) {
        pz.ns(ns);
    };

    var o = (isDefault ? this : _getObjectByNamespaceString(ns));
    if (_isEmpty(type)) {
        pz.assignTo(o, obj, false);
    } else {
        o[type] = obj;
    };
};

pz.getDefinitionOf = function (type) {
    var item = _get(this, type);

    if (_isEmpty(item)) {
        var msg = _const.typeNotFound.replace('{0}', type);
        throw new Error(msg);
    };

    return item.definition;
};

pz.getInstanceOf = function (typeOrIdOrAlias, all) {
    return _get(this, typeOrIdOrAlias, true, all);
};

pz.defineApplication = function (config) {
    var rootComponents = !pz.isEmpty(config.components) && pz.isArray(config.components) ? 
        config.components : [], globalScope = _getGlobal();
    delete config.components;
    delete config.instances;
    _assignTo(pz.application, config);

    if (_isEmpty(globalScope[config.namespace])) {
        this.ns(config.namespace, config);
        pz.assignTo(globalScope[config.namespace], config, false);
    } else {
        pz.assignTo(globalScope[config.namespace], config, false);
    };

    pz.forEach(rootComponents, function (item) {
        var def = pz.getDefinitionOf(item);
        if (_isFunction(def.create)) {
            def.create();
        };
    });

    _invokeIfExists('init', config);
};

pz.find = function (callback, arr, scope) {
    var findFnSupported = ('find' in Array.prototype); // find is not supported in IE
    var res = findFnSupported ? arr.find(callback, scope) :
        _find(arr, callback, scope);
    callback = null;
    return res;
};

pz.definitions = [];
pz.application = {
    instances: []
};
pz.define = _define;
pz.create = _create;
pz.toObject = _toObject;
pz.toFunction = _toFunction;
pz.isTypeOf = _isTypeOf;
pz.isArray = _isArray;
pz.isObject = _isObject;
pz.isFunction = _isFunction;
pz.isString = _isString;
pz.isNodeList = _isNodeList;
pz.isEmpty = _isEmpty;
pz.is = _is;
pz.isComponent = _isComponent;
pz.isMixin = _isMixin;
pz.isClass = _isClass;
pz.forEach = _forEach;
pz.proxy = _proxy;
pz.guid = _guid;
pz.toJSON = _toJSON;
pz.assignTo = _assignTo;
pz.isInstanceOf = _isInstanceOf;
pz.getGlobal = _getGlobal;
pz.camelize = _camelize;
pz.format = _format;
pz.isPzDefinition = _isPzDefinition;
pz.deepClone = _deepClone;
pz.isModularEnv = _isModularEnv;
