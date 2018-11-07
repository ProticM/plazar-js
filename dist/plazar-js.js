// PlazarJS
var pz;
(function (pz) {
    'use strict';

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
        coreBaseTypes: ['base', 'mixin']
    };

    var _find = function (array, fn, scope) {
        var i = 0, len = array.length;
        for (; i < len; i++) {
            if (fn.call(scope || array, array[i], i)) {
                return array[i];
            };
        };
        return null;
    }; // this is array helper and it's here due to possible circular reference in modular environment (pz.arr.find synonym)

    var _assignTo = function (target, source, clone) { 

        var assign = function (target) { // polyfill

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
                            to[nextKey] = nextSource[nextKey].slice();
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
    }; // this is object helper and it's here due to possible circular reference in modular environment (pz.obj.assignTo synonym)

    var _setRequiredInstances = function (obj) {
        var requireDefined = !pz.isEmpty(obj.require) &&
            pz.isArray(obj.require);

        if (!requireDefined) {
            return;
        };

        pz.forEach(obj.require, function (requiredItemType) {
            var instance = pz.getInstanceOf(requiredItemType)
            var requiredItem = pz.isEmpty(instance) ?
                pz.getDefinitionOf(requiredItemType) : instance;
            var camelCaseName = pz.str.camelize(requiredItemType);

            if (!pz.isEmpty(requiredItem) && pz.isEmpty(obj[camelCaseName])) {
                obj[camelCaseName] = !pz.isFunction(requiredItem) ? requiredItem :
                    pz.create(requiredItemType);
            };
        });
    };

    var _define = function (type, object) {

        var me = this, cls, obj, tBase,
            isMixin, method, args, skipInheritance;

        if (pz.isEmpty(type) || pz.isEmpty(object)) {
            throw new Error(_const.canNotDefine);
        };

        obj = pz.toObject(object);
        skipInheritance = pz.isEmpty(obj.ownerType) ||
            (_const.coreBaseTypes.indexOf(type) != -1);

        cls = skipInheritance ? pz.toFunction(obj) : (function () {
            tBase = pz.getDefinitionOf(obj.ownerType);
            isMixin = pz.isMixin(obj);
            return isMixin ? pz.assignTo(obj, pz.assignTo({}, tBase.prototype), false) :
                tBase.extend(obj);
        })();

        if (skipInheritance) {
            cls.extend = object.extend;
        };

        if (!isMixin) {
            cls.create = (function (type) {
                var _type = type;

                return function () {
                    return me.create(_type);
                };

            })(type);
        };

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
            instance = new item(params);
            pz.assignTo(instance, config, false);
        } else {
            instance = new item();
            instance.type = type;
        };

        instance.id = pz.guid();
        _setRequiredInstances(instance);

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
        var parent = window, current = '';
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
        if (parts.length == 1) {
            return window[namespace];
        };

        return parts.reduce(function (previous, current) {
            if (pz.isString(previous)) {
                return window[previous][current];
            };

            return previous[current];
        });
    };

    pz.ns = function (name, config) {
        _defineNamespace(name, config || {});
    };

    pz.defineStatic = function (type, object, namespace) {

        var obj = _toObject(object);
        var ns = _isEmpty(namespace) ? 'statics' : namespace;

        if (_isEmpty(window[ns])) {
            pz.ns(ns);
        };

        var o = _getObjectByNamespaceString(ns);
        if (_isEmpty(type)) {
            pz.assignTo(o, obj, false);
        } else {
            o[type] = obj;
        };
    };

    pz.getDefinitionOf = function (type) {
        var item = _get(this, type);

        if (_isEmpty(item)) {
            var msg = pz.str.format(_const.typeNotFound, type);
            throw new Error(msg);
        };

        return item.definition;
    };

    pz.getInstanceOf = function (typeOrIdOrAlias, all) {
        return _get(this, typeOrIdOrAlias, true, all);
    };

    pz.defineApplication = function (config) {
        var rootComponents = !pz.isEmpty(config.components) && pz.isArray(config.components) ? 
            config.components : [];
        delete config.components;
        delete config.instances; // making sure that we do not override the instances array if passed accidentally via config
        _assignTo(pz.application, config);

        if (_isEmpty(window[config.namespace])) {
            this.ns(config.namespace, config);
            pz.assignTo(window[config.namespace], config, false);
        } else {
            pz.assignTo(window[config.namespace], config, false);
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

})(pz || (pz = {}));

pz.defineStatic('http', function () {
    'use strict';

    var _const = {
        optionsRequred: 'Can not instantiate http request without options defined',
        minConfigNotProfided: 'Minimal configuration for ajax call was not provided. Please check you setup for following options [url], [method]',
        requestStates: {
            done: 4
        },
        requestStatus: {
            abort: 0
        }
    };

    var _types = {
        post: 'POST',
        get: 'GET',
        put: 'PUT',
        data: {
            json: 'json',
            html: 'html'
        }
    };

    var _createXHR = function () {
        // TODO: Add support for active x object?
        // ActiveXObject('MSXML2.XMLHTTP.3.0');
        // ActiveXObject('MSXML2.XMLHTTP');
        // ActiveXObject('Microsoft.XMLHTTP');
        return new XMLHttpRequest();
    };

    var _checkMinimalConfiguration = function (options) {
        // add more if needed

        var isOK = !pz.isEmpty(options.url) &&
            !pz.isEmpty(options.method);

        if (!isOK) {
            throw new Error(_const.minConfigNotProfided);
        };
    };

    var _configureAndInvokeXHR = function (request, options) {
        var xhr = request.xhr, callback = options.success,
            eCallback = options.fail, aCallback = options.abort,
            dataType = options.dataType || _types.data.json;

        xhr.onreadystatechange = function () {

            if (this.readyState == _const.requestStates.done
                && this.status == _const.requestStatus.abort) {
                return;
            };

            if (this.readyState == _const.requestStates.done && !pz.isEmpty(callback)) {
                var result = {
                    request: this,
                    data: (dataType == _types.data.json ? pz.toJSON(this.responseText) : this.responseText),
                    dataType: dataType
                };
                callback.call(this, result);
                delete pz.http.requests[request.id];
            };
        };

        xhr.onerror = function (e) {
            delete pz.http.requests[request.id];

            if (eCallback) {
                eCallback(e.target);
            } else {
                throw new Error(e.target.statusText);
            };
        };

        xhr.onabort = function (e) {
            if (aCallback) {
                aCallback(e);
            };
        };

        xhr.open(options.method, options.url, true);

        if (pz.isString(options.data)) {
            options.data = pz.toJSON(options.data);
        };

        xhr.send(options.data || null);
    };

    return {
        requests: {},
        latestRequestId: null,
        request: function (options) {

            if (pz.isEmpty(options)) {
                throw new Error(_const.optionsRequred);
            };

            _checkMinimalConfiguration(options);

            var request = {
                id: pz.guid(),
                aborted: false,
                options: options,
                xhr: _createXHR(),
                abort: function myfunction() {
                    this.xhr.abort();
                    this.xhr = null;
                    this.aborted = true;
                }
            };

            this.latestRequestId = request.id;
            _configureAndInvokeXHR(request, options);
            this.requests[request.id] = request;
            return request;
        },
        abort: function (all) {
            var abortAll = all || false, requestIds;
            var requestToAbort = abortAll ? this.requests :
                this.requests[this.latestRequestId];

            if (pz.isEmpty(requestToAbort)) {
                return;
            };

            if (!abortAll) {
                requestToAbort.abort();
                delete this.requests[this.latestRequestId];
                this.latestRequestId = null;
                return;
            };

            requestIds = pz.obj.getKeys(requestToAbort);
            pz.forEach(requestIds, function (id) {
                var request = this.requests[id];
                request.abort();
                delete this.requests[id];
                request = null;
            }, this);

            requestToAbort = null;
            this.latestRequestId = null;
        },
        post: function (options) {
            options.method = _types.post;
            return this.request(options);
        },
        get: function (options) {
            options.method = _types.get;
            return this.request(options);
        }
    }
}, 'pz');

pz.defineStatic('binder', function () {
    'use strict';

    var observable, observableArray,
        binding, view, observe, observeArray, textParser,
        parseKeyPath, buildContext, reservedKeys, bindingRegex,
        getBindingRegex;

    // helpers
    reservedKeys = {
        idx: '$index',
        current: '$current',
        root: '$root',
        as: ' as ',
        observed: '$observed',
        view: '$view'
    };

    getBindingRegex = function () {
        if (pz.isEmpty(bindingRegex)) {
            bindingRegex = RegExp('^' + pz.binder.prefix + '-', 'i');
        };

        return bindingRegex;
    };

    parseKeyPath = function (keypath, target) {

        var parts = keypath.split('.');
        if (parts.length == 1) {
            return target;
        };

        parts.pop();
        return parts.reduce(function (previous, current) {
            var isString = pz.isString(previous);
            return isString ? window[previous][current] :
                (pz.isEmpty(previous) ? null : previous[current]);
        }, target);
    };

    buildContext = function (keypath, vm, ctx) {
        var hasCtx = ctx != null,
            isPath = /^[a-z$][a-z0-9]*(?:\.[a-z0-9]+)+$/i.test(keypath),
            fromRoot = isPath && keypath.indexOf(reservedKeys.root) != -1;

        keypath = fromRoot ? keypath.split('.').slice(1).join('.') : keypath;

        return (hasCtx && !isPath && !fromRoot ? ctx : parseKeyPath(keypath, vm)) ||
            parseKeyPath(keypath, ctx);
    };

    observe = function (value) {
        // TODO: Multidimensional arrays 
        if (!pz.isObject(value) || value.$observed) {
            return false;
        };

        var properties = Object.keys(value);

        pz.forEach(properties, function (prop) {

            var propValue = value[prop];

            var obsArray = observeArray(value, propValue, prop);

            if (obsArray && !pz.isInstanceOf(value, observableArray)) {
                value[prop] = obsArray;
            };

            if (!obsArray && !pz.isInstanceOf(value, observable) && !observe(propValue) &&
                !pz.isFunction(propValue)) {
                value[prop] = new observable(value, prop);
            };
        });

        value.$observed = true;
        return true;
    };

    observeArray = function (obj, collection, prop) {

        var isArray = pz.isArray(collection);
        var obsArray;

        if (!isArray) {
            return obsArray;
        };

        obsArray = new observableArray(obj, collection, prop);
        pz.forEach(obsArray, function (item) {
            observe(item);
        });

        return obsArray;
    };
    //
    observable = (function () {

        var defineReactive = function (me, obj, key) {
            var value = obj[key];

            delete obj[key];
            Object.defineProperty(obj, key, {
                configurable: true,
                enumerable: true,
                set: function (newValue) {
                    var val = newValue.value != null || newValue.value != undefined ? newValue.value : newValue;
                    var shouldNotify = val != value && me.notify != undefined;
                    value = val;
                    if (shouldNotify) {
                        me.notify();
                    };
                },
                get: function () {
                    var get = function () {
                        return value;
                    };

                    get.subscribe = function (callback, bindingId) {
                        me.subscribe.call(me, callback, bindingId);
                    };

                    get.unsubscribe = function (bindingId) {
                        me.unsubscribe.call(me, bindingId);
                    };

                    return get;
                }
            });
        };

        function observable(obj, key) {
            this.value = obj[key];
            this.prop = key;
            this.subscriptions = [];
            defineReactive(this, obj, key);
            return this;
        };

        observable.prototype.notify = function () {
            if (this.subscriptions.length == 0) {
                return;
            };

            pz.forEach(this.subscriptions, function (subscription) {
                subscription.update.call(this, subscription);
            }, this);
        };

        observable.prototype.subscribe = function (callback, bindingId) {
            var length = this.subscriptions.length;
            this.subscriptions.push({
                id: bindingId || length++,
                update: callback
            });
        };

        observable.prototype.unsubscribe = function (bindingId) {
            var bindingSubs = this.subscriptions.filter(function (sub) {
                return sub.id == bindingId;
            });

            pz.forEach(bindingSubs, function (sub) {
                var idx = this.subscriptions.indexOf(sub);
                this.subscriptions.splice(idx, 1);
            }, this);
        };

        return observable;

    })();

    observableArray = (function () {
        var observableMethods = 'pop push shift unshift splice reverse sort'.split(' '),
            normalMethods = 'slice concat join some every forEach map filter reduce reduceRight indexOf lastIndexOf toString toLocaleString'.split(' '),
            arrPrototype = Array.prototype;

        var handleSubscriptions = function (me, subscribe, name, callback, bindingId) {

            if (!observableMethods[name]) {
                throw new Error('Can not ' + (subscribe ? 'subscribe to' : 'unsubscribe from') + ' action named: [' + name + ']');
            };

            // TODO: Unsubscribe
            var length = me.subscriptions.length;
            me.subscriptions.push({
                id: bindingId || length++,
                name: name,
                callback: callback
            });
        };

        function observableArray(obj, collection, prop) {
            collection = collection || [];

            this.subscriptions = [];
            this.prop = prop;

            for (var i = 0; i < collection.length; i++) {
                this.push(collection[i]);
            };

            var length = this.length;
            this.hasData = length > 0;

            Object.defineProperty(this, 'length', {
                configurable: false,
                enumerable: true,
                set: function (newValue) {
                    var newItem;

                    if (newValue > length) { // push or unshift
                        newItem = this.__action == 'push' ? this[length] : this[0];
                        observe(newItem);
                    };

                    if (newValue != length) {
                        length = newValue;
                        this.hasData = length > 0;
                    };
                },
                get: function () {
                    return length;
                }
            });

            this.hasData = new observable(this, 'hasData');
            return this;
        };

        observableArray.prototype = [];

        pz.forEach(observableMethods, function (methodName) {

            var method = arrPrototype[methodName];

            observableArray.prototype[methodName] = function () {
                this.__action = methodName;
                var returnValue = method.apply(this, arguments);

                var subscription = this.subscriptions.filter(function (subscription) { // find not supported in IE
                    return subscription.name == methodName;
                })[0];

                if (subscription) {
                    var args = arrPrototype.slice.call(arguments);
                    subscription.callback.apply(this, args);
                };

                delete this.__action;
                return returnValue;
            };
        });

        pz.forEach(normalMethods, function (methodName) {
            observableArray.prototype[methodName] = arrPrototype[methodName];
        });

        observableArray.prototype.subscribe = function (callback, bindingId) {

            this.subscriptions.splice(0, this.subscriptions.length);
            pz.forEach(observableMethods, function (action) {
                handleSubscriptions(this, true, action, callback, bindingId);
            }, this);
            callback = null;
        };

        observableArray.prototype.unsubscribe = function (bindingId) {

            var bindingSubs = this.subscriptions.filter(function (sub) {
                return sub.id == bindingId;
            });

            pz.forEach(bindingSubs, function (sub) {
                var idx = this.subscriptions.indexOf(sub);
                this.subscriptions.splice(idx, 1);
            }, this);
        };

        observableArray.prototype.getFirst = function () {
            return this.getAt(0);
        };

        observableArray.prototype.getLast = function () {
            return this.getAt(this.length - 1);
        };

        observableArray.prototype.getAt = function (index) {

            if (pz.isEmpty(index)) {
                return null;
            };

            return this[index];
        };

        observableArray.prototype.removeAll = function () {
            this.splice(0, this.length);
        };

        return observableArray;
    })();

    textParser = {
        parse: function (el) {

            var hasInterpolations,
                keypaths, updateContent, elData;

            if (el.nodeType != 3 || el.textContent.length == 0) {
                return;
            };

            hasInterpolations = (el.textContent.indexOf(pz.binder.delimiters[0]) != -1 &&
                el.textContent.indexOf(pz.binder.delimiters[1]) != -1);

            if (!hasInterpolations) {
                return;
            };

            keypaths = [];

            updateContent = (function (me, _vm) {
                return function (data, parsed) {
                    data.el.textContent = data.tpl.replace(/{([^}]*)}/g, function (template, value) {
                        var isPath, val, vmValue, curr, idx;

                        value = value.replace(/ +?/g, '');
                        curr = value.indexOf(reservedKeys.current) != -1;
                        idx = value.indexOf(reservedKeys.idx) != -1;
                        vmValue = (!curr ? (!idx ? _vm[value] : me.index) : _vm);
                        isPath = /^[a-z$][a-z0-9]*(?:\.[a-z0-9]+)+$/i.test(value);

                        if (isPath) {
                            val = value.split('.').pop();
                            vmValue = ((me.ctx && me.ctx[val]) || me.vm[val]) ||
                                buildContext(value, me.vm, me.ctx)[val];
                            val = null;
                        };

                        if (!parsed) {
                            keypaths.push(value);
                        };

                        var result = (!pz.isEmpty(vmValue) ?
                            (pz.isFunction(vmValue) ? vmValue() : vmValue) : template);
                        vmValue = null;
                        return result;
                    });
                };
            })(this, this.ctx || this.vm);

            if (!this.elsData) {
                this.elsData = [];
            };

            elData = {
                el: el,
                tpl: el.textContent.trim()
            };

            this.elsData.push(elData);
            updateContent(elData, false);

            (function (me, elsData) {
                pz.forEach(keypaths, function (keypath) {
                    var ctx = buildContext(keypath, me.vm, me.ctx);
                    var prop = keypath.split('.').pop();
                    var observer = ctx[prop];
                    if (observer) {
                        observer.subscribe(function () {
                            pz.forEach(elsData, function (data) {
                                updateContent(data, true);
                            });
                        });
                    };
                    ctx = null;
                });
            })(this, this.elsData);

            keypaths.splice(0, keypaths.length);
            this.elsData.splice(0, keypaths.length);
        }
    };

    binding = (function () {

        var parseAlias = function (keypath) {
            var as = keypath.indexOf(reservedKeys.as) != -1,
                parts, result = { keypath: keypath, alias: null };

            if (!as) {
                return result;
            };

            parts = keypath.split(reservedKeys.as);
            result.keypath = parts.shift().trim();
            result.alias = parts.pop().trim();
            parts = null;
            return result;
        };

        function binding(el, type, keypath, bindingAttr, view) {
            var result = parseAlias(keypath);

            this.id = pz.guid();
            this.el = el;
            this.view = view;
            this.type = type;
            this.keypath = result.keypath.trim();
            this.alias = result.alias || null;
            this.bindingAttr = bindingAttr;
            this.prop = result.keypath.split('.').pop();
            this.rootVm = view.vm;
            this.vm = buildContext(result.keypath, view.vm, view.ctx);
            this.binder = pz.binder.binders[this.type];
            this.handler = this.binder.handler ? pz.proxy(this.binder.handler, this) : undefined;
            view = null;
            return this;
        };

        binding.prototype.bind = function () {

            var observer = this.vm[this.prop];

            if (this.binder.bind) {
                this.binder.bind.call(this);
            };

            if (this.binder.react && observer && observer.subscribe) {
                (function (me, obs) {
                    obs.subscribe(function () {
                        me.binder.react.call(me);
                    }, me.id);
                })(this, observer);
            };

            if (this.binder.react) {
                this.binder.react.call(this);
            };
        };

        binding.prototype.unbind = function () {
            var observer = this.vm[this.prop];
            if (observer && observer.unsubscribe) {
                observer.unsubscribe(this.id);
            };
            if (pz.isFunction(this.binder.unbind)) {
                this.binder.unbind.call(this);
            };
        };

        binding.prototype.getValue = function () {

            var prop, isFn;

            if (this.prop == reservedKeys.current) {
                return this.vm;
            };

            if (this.prop == reservedKeys.idx) {
                return this.view.index;
            };

            prop = this.vm[this.prop];
            var isFn = pz.isFunction(prop);
            return isFn ? this.vm[this.prop].call(this) : this.vm[this.prop];
        };

        binding.prototype.setValue = function (value) {
            return this.vm[this.prop] = value;
        };

        return binding;
    })();

    view = (function () {

        var parseAttrName = function (name) {
            var startIdx, endIdx;
            var inBrackets = ((startIdx = name.indexOf('[')) != -1) &&
                ((endIdx = name.indexOf(']')) != -1), attrToBind, parts;

            if (!inBrackets) {
                return name.split('-');
            };

            attrToBind = name.substring((startIdx + 1), endIdx);
            name = name.replace('-[' + attrToBind + ']', '');
            parts = name.split('-');
            parts.push(attrToBind);
            return parts;
        };

        function view(el, vm, ctx, index) {
            this.els = pz.isArray(el) || pz.isNodeList(el) ? el : [el];
            this.vm = vm;
            this.ctx = ctx || null;
            this.index = !pz.isEmpty(index) ? index : null;
            this.buildBindings();
            vm = null;
            return this;
        };

        view.prototype.bind = function () {
            pz.forEach(this.bindings, function (binding) {
                binding.bind();
            });
        };

        view.prototype.unbind = function () {
            pz.forEach(this.bindings, function (binding) {
                binding.unbind();
            });
        };

        view.prototype.buildBindings = function () {
            this.bindings = [];

            var build = (function (me) {
                return function (els) {
                    pz.forEach(els, function (el) {
                        var isBlock = (el.hasAttribute && el.hasAttribute(pz.binder.prefix + '-each')),
                            attrs = isBlock ? [el.getAttributeNode(pz.binder.prefix + '-each')] : (el.attributes || []);

                        pz.forEach(attrs, function (attr) {
                            if (getBindingRegex().test(attr.name)) {
                                var parts = parseAttrName(attr.name);
                                var bType = parts[1], attrToBind = parts[2];

                                if (!pz.isEmpty(pz.binder.binders[bType])) {
                                    var b = new binding(el, bType.toLowerCase(), attr.value, attr.name, me);
                                    if (attrToBind) { b.attrToBind = attrToBind; };

                                    me.bindings.push(b);
                                    isBlock = isBlock || b.binder.block;
                                    b = null;
                                };
                            };
                        });

                        if (!isBlock) {
                            pz.forEach(el.childNodes, function (childNode) {
                                build([childNode]);
                                textParser.parse.call(me, childNode);
                            });
                        };
                    });
                };
            })(this);

            build(this.els);
            this.bindings.sort(function (a, b) {
                return a.binder.priority - b.binder.priority;
            });
        };

        return view;

    })();

    return {
        prefix: 'data',
        delimiters: ['{', '}'],
        bind: function (els, viewModel) {

            if (viewModel.$view) {
                viewModel.$view.bind();
                return;
            };

            observe(viewModel);
            var v = new view(els, viewModel);
            v.bind();
            viewModel.$view = v;
            v = null;
        },
        unbind: function (viewModel) {
            if (viewModel.$view) {
                viewModel.$view.unbind();
            };
        },
        toJSON: function (viewModel) {
            // TODO: Multidimensional arrays

            var getProperties = function (value) {
                return Object.keys(value).filter(function (key) {
                    return key != reservedKeys.observed && key != reservedKeys.view;
                })
            }, toJSON = function (value, res) {

                var properties = getProperties(value);

                pz.forEach(properties, function (prop) {

                    var isObject = pz.isObject(value[prop]),
                        isFunction = pz.isFunction(value[prop]),
                        isObsArray = pz.isInstanceOf(value[prop], observableArray);

                    if (isObject) {
                        toJSON(value[prop], res);
                    };

                    if (isObsArray) {
                        res[prop] = [];
                        var dataKeys = Object.keys(value[prop]).filter(function (key) {
                            return !isNaN(parseInt(key));
                        });

                        pz.forEach(dataKeys, function (key) {
                            var item = value[prop][key];
                            var val = (pz.isObject(item) ? toJSON(item, {}) :
                                (pz.isFunction(item) ? item() : item));
                            res[prop].push(val);
                        });
                    };

                    if (isFunction) {
                        res[prop] = value[prop]();
                    };
                });

                return res;
            };

            return toJSON(viewModel, {});
        },
        binders: {
            'value': {
                priority: 3,
                bind: function () {

                    var isInput = this.el.nodeName == 'INPUT',
                        isOption = this.el.nodeName == 'OPTION',
                        isSelect = this.el.nodeName == 'SELECT',
                        isTextArea = this.el.nodeName == 'TEXTAREA',
                        event, isText;

                    if (!isInput && !isOption && !isSelect && !isTextArea) {
                        throw new Error('Value binding is supported only on INPUT, OPTION or SELECT element');
                    };

                    event = isInput || isTextArea ? (('oninput' in window) ? 'input' : 'keyup') : 'change';
                    isText = isInput && this.el.type == 'text' || isTextArea;

                    if ((isSelect || isText) && pz.isFunction(this.handler)) {
                        this.el.removeEventListener(event, this.handler, false);
                        this.el.addEventListener(event, this.handler, false);
                        this.event = event;
                    };

                    this.el.removeAttribute(this.bindingAttr);
                },
                react: function () {
                    // ISSUE: triggered on change, but value is already correct;
                    var isInput = this.el.nodeName == 'INPUT',
                        isSelect = this.el.nodeName == 'SELECT',
                        isTextArea = this.el.nodeName == 'TEXTAREA',
                        isText = isInput && this.el.type == 'text';

                    if (isText || isSelect || isTextArea) {
                        this.el.value = this.getValue();
                    } else {
                        this.el.setAttribute('value', this.getValue());
                    };
                },
                handler: function () {
                    this.setValue(this.el.value);
                },
                unbind: function () {
                    this.el.removeEventListener(this.event, this.handler, false);
                }
            },
            'each': {
                priority: 1,
                block: true,
                bind: function () {

                    if (!this.mark) {
                        this.mark = document.createComment('each:' + this.id);
                        this.el.removeAttribute(this.bindingAttr);
                        this.el.parentNode.insertBefore(this.mark, this.el);
                        this.el.parentNode.removeChild(this.el);
                    };

                    if (!this.views) {
                        this.views = [];
                    };
                },
                react: function () {

                    var value = this.getValue(), template;

                    pz.forEach(this.views, function (view) {
                        view.unbind();
                        pz.forEach(view.els, function (el) {
                            el.parentNode.removeChild(el);
                            el = null;
                        });
                        view.els.splice(0, view.els.length);
                    });

                    this.views.splice(0, this.views.length);

                    pz.forEach(value, function (item, idx) {

                        if (this.alias) {
                            this.rootVm[this.alias] = item;
                        };

                        template = this.el.cloneNode(true);
                        var v = new view(template, this.rootVm, item, idx);
                        v.bind();
                        this.mark.parentNode.insertBefore(template, this.mark);
                        this.views.push(v);
                    }, this);

                    delete this.rootVm[this.alias];
                },
                unbind: function () {
                    pz.forEach(this.views, function (view) {
                        view.unbind();
                    });
                }
            },
            'text': {
                priority: 3,
                bind: function () {
                    this.el.removeAttribute(this.bindingAttr);
                },
                react: function () {
                    var hasInnerText = this.el.hasOwnProperty('innerText');
                    this.el[hasInnerText ? 'innerText' : 'innerHTML'] = this.getValue();
                }
            },
            'if': {
                priority: 2,
                bind: function (val) {
                    var value = val != undefined ? val : this.getValue();
                    this.el.removeAttribute(this.bindingAttr);

                    if (!value && !pz.isEmpty(this.el.parentNode)) {
                        this.el.parentNode.removeChild(this.el);
                    };
                }
            },
            'ifnot': {
                priority: 2,
                bind: function () {
                    var value = this.getValue();
                    pz.binder.binders.if.bind.call(this, !value);
                }
            },
            'visible': {
                priority: 2,
                bind: function () {
                    this.el.removeAttribute(this.bindingAttr);
                },
                react: function (val) {
                    var value = val != undefined ? val : this.getValue();

                    if (this.initialValue == undefined) {
                        this.initialValue = this.el.style.display;
                    };

                    this.el.style.display = (value == true ?
                        (this.initialValue == 'none' ? '' : this.initialValue) : 'none');
                }
            },
            'hidden': {
                bind: function () {
                    pz.binder.binders.visible.bind.call(this);
                },
                react: function () {
                    var value = this.getValue();
                    pz.binder.binders.visible.react.call(this, !value);
                }
            },
            'html': {
                bind: function () {
                    this.el.removeAttribute(this.bindingAttr);
                },
                react: function () {
                    this.el.innerHTML = this.getValue();
                }
            },
            'attr': {
                priority: 2,
                bind: function () {
                    this.el.removeAttribute(this.bindingAttr);
                },
                react: function () {
                    var isClassAttr = (this.attrToBind == 'class');
                    var value = this.getValue();

                    if (isClassAttr && this.el.hasAttribute(this.attrToBind)) {
                        value = (this.el.getAttribute(this.attrToBind) + ' ' + value).trim();
                    };

                    this.el.setAttribute(this.attrToBind, value.toString());
                }
            },
            'checked': {
                bind: function () {
                    this.el.removeEventListener('change', this.handler, false);
                    this.el.addEventListener('change', this.handler, false);
                    this.event = 'change';
                    this.el.removeAttribute(this.bindingAttr);
                },
                react: function () {
                    // ISSUE: triggered on change, but value is already correct;

                    var isRadio = this.el.type == 'radio',
                        value = this.getValue();

                    if (isRadio) {
                        this.el.checked = value == this.el.value;
                    } else {
                        this.el.checked = value;
                    };
                },
                handler: function () {
                    var isRadio = this.el.type == 'radio';
                    this.setValue((isRadio ? this.el.value : this.el.checked));
                },
                unbind: function () {
                    this.el.removeEventListener(this.event, this.handler, false);
                }
            },
            'enabled': {
                bind: function () {
                    this.el.removeAttribute(this.bindingAttr);
                },
                react: function () {
                    var value = this.getValue();
                    this.el.disabled = !value;
                }
            },
            'options': {
                priority: 1,
                block: true,
                tempAttrs: {
                    val: null,
                    text: null
                },
                bind: function () {

                    this.el.removeAttribute(this.bindingAttr);

                    if (!this.views) {
                        this.views = [];
                    };

                    this.binder.tempAttrs.val = this.binder.tempAttrs.val || this.el.getAttribute('data-optionsvalue');
                    this.binder.tempAttrs.text = this.binder.tempAttrs.text || this.el.getAttribute('data-optionstext');
                    this.el.removeAttribute('data-optionsvalue');
                    this.el.removeAttribute('data-optionstext');
                },
                react: function () {
                    var value = this.getValue();

                    pz.forEach(this.views, function (view) {
                        view.unbind();
                        pz.forEach(view.els, function (el) {
                            el.parentNode.removeChild(el);
                            el = null;
                        });
                        view.els.splice(0, view.els.length);
                    });

                    this.views.splice(0, this.views.length);

                    pz.forEach(value, function (item, idx) {
                        var template = document.createElement('option');
                        template.setAttribute('data-value', this.binder.tempAttrs.val);
                        template.setAttribute('data-text', this.binder.tempAttrs.text);

                        var v = new view(template, this.rootVm, item, idx);
                        v.bind();
                        this.el.appendChild(template);
                        this.views.push(v);
                        template = null;
                    }, this);
                }
            },
            unbind: function () {
                pz.forEach(this.views, function (view) {
                    view.unbind();
                });
            }
        }
    };

}, 'pz');

pz.defineStatic('arr', function () {
    'use strict';

    return {
        clear: function (array) {
            if (pz.isEmpty(array)) {
                return;
            };

            array.splice(0, array.length);
        },

        find: function (callback, arr, scope) {
            return pz.find(callback, arr, scope);
        },

        contains: function (array, item, fromIndex) {
            var isFunction = pz.isFunction(item);

            return isFunction ? (function () {
                var el = pz.arr.find(item, array);
                return !pz.isEmpty(el);
            })() : pz.isEmpty(array) ? false : array.indexOf(item, fromIndex) != -1;
        },

        filter: function (callback, array) {
            var res = array.filter(callback);
            callback = null;
            return res;
        },

        merge: function () {
            var args = Array.prototype.slice.call(arguments),
                resultArray = [];

            pz.forEach(args, function (array) {
                resultArray = resultArray.concat(array);
            });

            return resultArray;
        },

        map: function (callback, array, scope) {
            var result = array.map(callback, scope);
            callback = null;
            return result;
        },

        removeAt: function (array, index) {
            if (pz.isEmpty(array) || pz.isEmpty(index)) {
                return;
            };

            array.splice(index, 1);
        },
    };

}, 'pz');

pz.defineStatic('str', function () {
    'use strict';

    return {
        camelize: function (str) {
            if (pz.isEmpty(str)) {
                return '';
            };

            return str.replace(/^([A-Z])|[\s-_](\w)/g, function (match, p1, p2, offset) {
                if (p2) return p2.toUpperCase();
                return p1.toLowerCase();
            });
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


pz.defineStatic('dom', function () {
    'use strict';

    var _tagNameReg = /<([^\s>]+)(\s|>)+/;

    var _wrapMap = {
        option: [1, "<select multiple='multiple'>", "</select>"],
        thead: [1, "<table>", "</table>"],
        col: [2, "<table><colgroup>", "</colgroup></table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"]
    };
    _wrapMap.optgroup = _wrapMap.option;
    _wrapMap.tbody = _wrapMap.tfoot = _wrapMap.colgroup = _wrapMap.caption = _wrapMap.thead;
    _wrapMap.th = _wrapMap.td;

    var _doInsert = function (element, newNode, where) {

        if (pz.isEmpty(element) || pz.isEmpty(newNode)) {
            return;
        };

        element.insertAdjacentHTML(where, (pz.isString(newNode) ?
            newNode : newNode.outerHTML));
    };

    var _getListener = function (me, element, event) {
        return pz.find(function (lst) {
            return lst.el == element && (!pz.isEmpty(event) ? (lst.event == event) : true);
        }, me.listeners);
    };

    var _delegate = {
        data: [],
        fn: function (e) {

            var target = null;
            var match = false, i = 0, parentEmpty = true,
                triggerEvent, targetMatches, dataItem, selector, fn,
                data = _delegate.data.filter(function (item) {
                    return item.type == e.type;
                });

            while (!pz.isEmpty(dataItem = data[i])
                && !(match = pz.dom.elementMatches(e.target, dataItem.selector))) {
                i++;
            };

            selector = (match ? dataItem.selector : undefined);
            fn = (match ? dataItem.fn : undefined);
            dataItem = null;
            targetMatches = match; //|| e.target == this;

            if (targetMatches) {
                target = e.target;
            };

            if (!targetMatches) {
                var parent = pz.dom.findParent(e.target, selector);
                parentEmpty = pz.isEmpty(parent);
                if (!parentEmpty) {
                    target = parent;
                };
            };

            triggerEvent = targetMatches || !parentEmpty;

            if (triggerEvent && pz.isEmpty(target)) {
                target = this;
            };

            if (triggerEvent) {
                fn.call(this, target, e);
            };
        }
    };

    return {
        clone: function (el) {
            return el.cloneNode(true);
        },

        replaceWith: function (node, newNode) {
            if (pz.isEmpty(node) || pz.isEmpty(newNode)) {
                return;
            };

            node.parentNode.replaceChild(newNode, node);
            node = null;
        },

        append: function (parent, element) {
            if (pz.isEmpty(parent) || pz.isEmpty(element)) {
                return;
            };

            if (pz.isString(element)) {
                element = this.parseTemplate(element);
            };

            parent.appendChild(element);
        },

        prepend: function (parent, element) {
            _doInsert(parent, element, 'afterbegin');
        },

        insertBefore: function (element, newNode) {
            _doInsert(element, newNode, 'beforebegin');
        },

        insertAfter: function (element, newNode) {
            _doInsert(element, newNode, 'afterend');
        },

        findElement: function (rootEl, selector, all) {

            if (pz.isEmpty(selector)) {
                return null;
            };

            return this.getEl(selector, { rootEl: rootEl, all: (all || false) });
        },

        elementMatches: function (element, selector) {
            var fn = Element.prototype.matches || Element.prototype.msMatchesSelector || function (s) {
                var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                    i = matches.length;
                while (--i >= 0 && matches.item(i) !== this) { };
                return i > -1;
            };
            return fn.call(element, selector);
        },

        findParent: function (el, selector, stopSelector) {
            var retval = null, me = this;
            while (!pz.isEmpty(el)) {
                if (this.elementMatches(el, selector)) {
                    retval = el;
                    break;
                } else if (stopSelector && this.elementMatches(el, stopSelector)) {
                    break;
                };
                el = el.parentElement;
            };
            return retval;
        },

        on: function (event, element, selector, fn) {
            // TODO: See if we can use only one collection (_delegate.data/this.listeners)
            var rootEl, lst;

            if (pz.isEmpty(fn)) {
                return;
            };

            rootEl = !pz.isEmpty(element) ? element : document;
            lst = _getListener(this, rootEl, event);
            _delegate.data.push({
                selector: selector,
                fn: fn,
                type: event
            });

            if (!pz.isEmpty(lst)) {
                return;
            };

            rootEl.addEventListener(event, _delegate.fn);
            this.listeners.push({
                el: rootEl,
                event: event
            });

        },

        getByAttr: function (attrValue, attrName) {
            var name = attrName || 'data-template';
            var selector = '*['.concat(name).concat('="').concat(attrValue).concat('"]');
            return document.querySelector(selector);
        },

        getEl: function (selector, options) {
            var getAll = options && options.all || false;
            var root = options && options.rootEl || document;
            var method = getAll ? 'querySelectorAll' : 'querySelector';
            var element = root[method](selector);
            return pz.isEmpty(element) ? null :
                ((element.length == 1 && element.nodeName != 'FORM') ? element[0] : element);
        },

        parseTemplate: function (template) {
            var tagName, temp, trimmed, i,
                regResult, wrapper, wrapperEmpty,
                fragment, result;

            if (!pz.isString(template)) {
                return null;
            };

            trimmed = template.trim();
            regResult = _tagNameReg.exec(trimmed);
            if (pz.isEmpty(regResult)) {
                return null;
            };

            fragment = document.createDocumentFragment();
            tagName = regResult[1];
            wrapper = _wrapMap[tagName];
            wrapperEmpty = pz.isEmpty(wrapper);

            temp = fragment.appendChild(this.createElement('div'));
            temp.innerHTML = wrapperEmpty ? trimmed : wrapper[1].concat(trimmed).concat(wrapper[2]);

            i = wrapperEmpty ? 0 : wrapper[0];
            while (i--) {
                temp = temp.lastChild;
            };

            result = temp.childNodes.length == 1 ?
                temp.lastChild : temp.childNodes;

            fragment = null;
            temp = null;
            return result;
        },

        createElement: function (tagName) {
            var el;
            try {
                el = document.createElement(tagName);
            } catch (e) {
                throw e;
            };
            return el;
        },

        remove: function (element) {
            var parent;

            if (pz.isEmpty(element)) {
                return;
            };

            parent = element.parentNode;
            if(!pz.isEmpty(parent)) {
                parent.removeChild(element);
            };
            element = null;
        },

        insertAt: function (parent, newNode, index) {
            var referenceNode;
            if (pz.isEmpty(parent) || pz.isEmpty(index)) {
                return;
            };

            if (pz.isEmpty(parent.childNodes)) {
                this.prepend(parent, newNode);
                return;
            };

            referenceNode = parent.childNodes[index];

            if (pz.isEmpty(referenceNode)) {
                throw new Error('Node at index: ' + index + ' was not found.');
            };

            parent.insertBefore(newNode, referenceNode);
        },

        off: function (element, event) {

            var index, listener = pz.find(function (lst, idx) {
                var found = lst.el == element && (!pz.isEmpty(event) ? (lst.event == event) : true);
                if (found) {
                    index = idx;
                };
                return found;
            }, this.listeners);

            if (!pz.isEmpty(listener)) {
                listener.el.removeEventListener(listener.event, _delegate.fn);
            };

            this.listeners.splice(index, 1);
        },

        listeners: [],

        indexOf: function (child) {
            var i = 0;
            while ((child = child.previousSibling) != null)
                i++;
            return i;
        }
    }

}, 'pz');

pz.defineStatic('obj', function () {
    'use strict';

    var _const = {
        canNotConvertNullOrEmptyObj: 'Cannot convert undefined or null to object'
    };

    return {

        assignTo: function (target, source, clone) {
            return pz.assignTo(target, source, clone);
        },

        clone: function (obj) {
            return this.assignTo({}, obj);
        },

        getKeys: Object.keys,

        getValues: function (obj) {

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

}, 'pz');

(function () {
    var base = function () {
        'use strict';

        return {
            mixins: [],
            init: function () { },
            destroy: function () {
                // TODO: multiple instances destroy
                var idx = pz.application.instances.indexOf(this);
                if (idx != -1) {
                    pz.application.instances.splice(idx, 1);
                };
            },
            applyMixins: function () {
                var me = this;
                pz.forEach(this.mixins, function (mixinName) {
                    var mixin = pz.getDefinitionOf(mixinName);
                    var cleanMixin = pz.obj.clone(mixin);
                    delete cleanMixin.ownerType;
                    pz.obj.assignTo(me, cleanMixin, false);
                });
            }
        };
    };

    base.extend = function extend(props) {
        // TODO: Inherit statics (maybe use TypeScript extend fn...but it has a possibility to run very slow!!)

        var properties = pz.toObject(props);
        var parentClass = this;

        var returnVal = (function (_parentClass, _properties) {
            var _hasCustomConstructor = _properties && _properties.constructor
                && _properties.constructor !== {}.constructor;
            var propertyNames = pz.obj.getKeys(_properties);
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

                        me[key] = (isArray ? _properties[key].slice() : (isObject ? pz.obj.clone(_properties[key]) : _properties[key]));
                    };
                });

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
            return pz_type;

        })(parentClass, properties);

        properties = null;
        parentClass = null;

        return returnVal;
    };

    pz.define('base', base);

    base = null;
})();

pz.define('class', function () {
    'use strict';

    return {
        ownerType: 'base'
    }
});

pz.define('component', function () {
    'use strict';

    var _const = {
        tplSourceNotDefined: 'Template source not defined. Please define one of these options in your component config: 1. [template]; 2. [templateSelector]; 3. [ajaxSetup.url]',
        tplContainerNotDefined: 'Template container selector not defined. Please define one of these options in your component config: 1. [renderTo]; 2. [templateSelector]; 3. [renderBefore]; 4. [renderAfter];',
        tplContainerNotFound: 'Template container not found. Please review one of these options in your component config: 1. [renderTo]; 2. [templateSelector]; 3. [renderBefore]; 4. [renderAfter];',
        tplContainerNotFoundWithinComponent: 'Template container not found within parent retrieved via selector: [{0}]. Please review one of these options in your component config: 1. [renderTo]; 2. [templateSelector]; 3. [renderBefore]; 4. [renderAfter];',
        loadingMaskMarkup: '<div class="loading-mask" style="color:#fff;background-color: #fff;position:absolute;top:0;left:0;bottom:0;width:100%;text-align:center;vertical-align:middle;height:100%">'
            .concat('<p style="position: absolute;top:40%;left:41.5%;background-color: #fff;padding: 5px;border: 1px solid #f1f1f1;color: #c0c0c0;z-index:1">loading...</p></div>'),
        addChildParamErr: 'Component you\'re trying to add, or it\'s [type] property has not been provided via parameter for [addChild] function. Example invocation: parent.addChild({ type: \'myType\' })',
        renderBeforeAndAfterDefined: '[renderBefore] and [renderAfter] config can not be defined on the same component',
        handlerFnNotProvided: 'Handler function was not provided.',
        canNotDestroyComponent: 'You can not destroy a component with attached pre-rendered template.'
    };

    return {
        constructor: function () {
            this.isComponentInstance = true;
        },
        ownerType: 'base',
        replace: false,
        initialized: false,
        animate: false,
        showLoading: false,
        autoLoad: false,
        css: [],
        attrs: [],
        style: '',
        bindViewModel: function () {

            var templateSelectorEmpty;

            if (pz.isEmpty(this.viewModel) || !pz.isFunction(this.applyBindings)) {
                return;
            };

            templateSelectorEmpty = pz.isEmpty(this.templateSelector);
            this.applyBindings();

            if (!templateSelectorEmpty) {
                var tpl = pz.dom.getByAttr(this.templateSelector);
                pz.dom.replaceWith(tpl, this.html);
                tpl = null;
            };

            this.publish('bindings-complete', null, this);
        },
        applyBindings: function () {
            pz.binder.bind(this.html, this.viewModel);
        },
        unapplyBindings: function () {
            pz.binder.unbind(this.viewModel);
        },
        traceUp: function () {
            return pz.isEmpty(this.parentComponent) ? null :
            (!pz.isEmpty(this.parentComponent.$ref) ? this.parentComponent.$ref 
                : pz.getInstanceOf(this.parentComponent.id));
        },
        traceDown: function (value) { // can be type, id or alias if defined on a component
            if (pz.isEmpty(this.components)) {
                return null;
            };

            var children = this.components.filter(function (childComponent) {
                var conditionOk = childComponent.type == value ||
                    childComponent.id == value || childComponent.alias == value;
                return conditionOk;
            }).map(function (childComponent) {
                return pz.getInstanceOf(childComponent.id);
            });

            return children.length == 1 ? children[0] : children;
        },
        load: function () {
            var templateSelectorEmpty = pz.isEmpty(this.templateSelector),
                templateEmpty = pz.isEmpty(this.template),
                urlEmpty = pz.isEmpty(this.ajaxSetup) || pz.isEmpty(this.ajaxSetup.url),
                componentLoaded;

            if (templateEmpty && templateSelectorEmpty && urlEmpty) {
                throw new Error(_const.tplSourceNotDefined);
            };

            if (urlEmpty) {
                this.render();
                return;
            };

            this.showLoadingMask();
            componentLoaded = pz.proxy(function (result) {
                var res = this.ajaxSetup.dataType == 'text' ? {
                    template: result.data
                } : result.data;

                this.viewModel = !pz.isEmpty(res.viewModel) ? res.viewModel :
                    this.viewModel;
                this.template = !pz.isEmpty(res.template) ? res.template :
                    pz.dom.getByAttr(this.templateSelector).outerHTML;
                this.publish('load-complete', null, this);
                this.render();
            }, this);

            pz.http.get({
                url: this.ajaxSetup.url,
                dataType: this.ajaxSetup.dataType,
                data: this.ajaxSetup.data,
                success: componentLoaded
            });

            componentLoaded = null;
        },
        render: function () {
            var templateSelectorEmpty = pz.isEmpty(this.templateSelector), me = this,
                renderToDefined, container, child, childDomIdx, renderBeforeDefined,
                renderAfterDefined, siblingContainer, insertBeforeOrAfter, containerSelector, isChild, containerErr;
            this.html = !templateSelectorEmpty ? pz.dom.getByAttr(this.templateSelector) :
                pz.dom.clone(pz.dom.parseTemplate(this.template)), me = this;
            this.addAttr({
                name: 'data-componentId',
                value: this.id
            });
            this.addCss(this.css);
            this.addAttr(this.attrs);
            this.addStyle(this.style);

            if (!templateSelectorEmpty) {
                this.init();
                return;
            };

            renderToDefined = !pz.isEmpty(this.renderTo);
            renderAfterDefined = !pz.isEmpty(this.renderAfter);
            renderBeforeDefined = !pz.isEmpty(this.renderBefore);

            if (!renderToDefined && !renderAfterDefined && !renderBeforeDefined) {
                throw new Error(_const.tplContainerNotDefined);
            };

            isChild = !pz.isEmpty(this.parentComponent);
            containerSelector = (isChild ? pz.str.format('{0} {1}', this.renderTo, ((renderBeforeDefined ? this.renderBefore : this.renderAfter) || '')).trim() : 
                (renderToDefined ? this.renderTo : (renderBeforeDefined ? this.renderBefore : this.renderAfter)));
            container = pz.dom.getEl(containerSelector);

            if (pz.isEmpty(container)) {
                containerErr = (isChild ? pz.str.format(_const.tplContainerNotFoundWithinComponent, containerSelector.split(']').pop().trim()) : 
                    _const.tplContainerNotFound);
                throw new Error(containerErr);
            };

            insertBeforeOrAfter = function (selector, method) {
                var parent = me.traceUp();
                var rootEl = !pz.isEmpty(parent) ? parent.html : document;
                siblingContainer = pz.dom.getEl(selector, { rootEl: rootEl, all: false });
                pz.dom[method](siblingContainer, me.html);
                me.html = pz.dom.getEl('*[data-componentid="' + me.id + '"]', { // get the dom reference since we will inject html string
                    rootEl: rootEl, all: false
                });
            };

            if (renderBeforeDefined) {
                insertBeforeOrAfter(containerSelector, 'insertBefore');
            } else if (renderAfterDefined) {
                insertBeforeOrAfter(containerSelector, 'insertAfter');
            } else if (!pz.isEmpty(this.insertAt)) {
                child = this.traceUp().childAt(this.insertAt);
                childDomIdx = pz.isEmpty(child) ? 0 : pz.dom.indexOf(child.html);
                pz.dom.insertAt(container, this.html, childDomIdx);
            } else {
                pz.dom[this.replace ? 'replaceWith' : 'append'](container, this.html);
            };

            this.publish('render-complete', null, this);
            this.init();
        },
        init: function () {

            var me = this, childrenToInitialize;
            this.bindViewModel();

            if (!pz.isEmpty(this.handlers)) {
                pz.forEach(this.handlers, function (handler) {
                    me.handle(handler);
                });
            };

            this.hideLoadingMask();
            this.initialized = true;
            this.publish('init-complete', null, this);

            if (!pz.isEmpty(this.components)) {
                childrenToInitialize = this.components.reduce(function (acc, cmpRef, idx) {
                    var cmp = pz.isEmpty(cmpRef.id) ? null : me.traceDown(cmpRef.id);
                    var needInitialization = pz.isEmpty(cmp) || !cmp.initialized;
                    if (needInitialization) {
                        acc.push({
                            index: idx,
                            component: cmpRef
                        });
                    };
                    return acc;
                }, []);

                pz.forEach(childrenToInitialize, function (item) {
                    item.component.$replace = true;
                    me.addChild(item.component, item.index);
                });

                pz.arr.clear(childrenToInitialize);
                childrenToInitialize = null;
            };

            if(!pz.isEmpty(this.parentComponent) && !pz.isEmpty(this.parentComponent.ref)) {
                this.parentComponent.$ref = null;
                delete this.parentComponent.$ref;
            };
        },
        subscribe: function (triggers) {
            if (pz.isEmpty(triggers) || !pz.isObject(triggers)) {
                return;
            };

            this.triggers = pz.obj.assignTo(this.triggers, triggers);
        },
        publish: function (name, params, component) {
            var me = this;

            var fire = function (component, params) {
                var trg = pz.isEmpty(component.triggers) ? null :
                    component.triggers[name];
                if (!pz.isEmpty(trg)) {
                    trg.call(component, params);
                };
            };

            if (!pz.isEmpty(component)) {
                var isString = pz.isString(component);
                var c = isString ? pz.getInstanceOf(component)
                    : component;
                fire(c, params);
                return;
            };

            pz.application.instances.filter(function (instance) { // events are allowed only on components
                return pz.isComponent(instance);
            }).forEach(function (component) {
                fire(component, params);
            });
        },
        addChild: function (child, index) {

            var hasChildren, parentSelector, instance, childReference, idx, renderTo,
                replace = child.$replace;
            if (pz.isEmpty(child) || pz.isEmpty(child.type)) {
                throw new Error(_const.addChildParamErr);
            };

            delete child.$replace;
            parentSelector = '*[data-componentid="' + this.id + '"]';

            child.autoLoad = false; // prevent auto load since we might be missing [renderTo] from config
            instance = pz.create(child);
            renderTo = child.renderTo || instance.renderTo;

            instance.renderTo = pz.isEmpty(renderTo) ?
                parentSelector.concat(!pz.isEmpty(this.containerElement) ? ' ' + this.containerElement : '') :
                (renderTo == 'root' ? parentSelector : parentSelector.concat(' ').concat(renderTo));

            instance.parentComponent = {
                type: this.type,
                id: this.id
            };

            if(!pz.isEmpty(instance.renderAfter) || !pz.isEmpty(instance.renderBefore)) {
                instance.parentComponent.$ref = this;
            };

            if (!pz.isEmpty(index) && !replace) {
                instance.insertAt = index;
            };

            if (!instance.autoLoad) {
                instance.load();
            };

            hasChildren = !pz.isEmpty(this.components);
            if (!hasChildren) {
                this.components = [];
            };

            childReference = {
                type: instance.type,
                id: instance.id
            };

            if (!pz.isEmpty(instance.alias)) {
                childReference.alias = instance.alias;
            };

            if (!pz.isEmpty(index)) {
                this.components.splice(index, (replace ? 1 : 0), childReference);
            } else {
                this.components.push(childReference);
            };

            childReference = null;
            return instance;
        },
        handle: function (handler) {
            var me = this;
            var fn = pz.isFunction(handler.fn) ? handler.fn : me[handler.fn];
            if (pz.isEmpty(fn)) {
                throw new Error(_const.handlerFnNotProvided);
            };
            var args = [handler.on, me.html, handler.selector, pz.proxy(fn, handler.scope || me)];
            pz.dom.on.apply(pz.dom, args);
        },
        showLoadingMask: function () {
            var renderToDefined = !pz.isEmpty(this.renderTo), container;
            if (!this.showLoading) {
                return;
            };

            var container = this.html;
            if (pz.isEmpty(container)) {
                container = renderToDefined ? pz.dom.getEl(this.renderTo) : pz.dom.getByAttr(this.templateSelector);
            };

            if (!pz.isEmpty(container)) {
                pz.dom.append(container, _const.loadingMaskMarkup);
            };
            container = null;
        },
        hideLoadingMask: function () {
            var renderToDefined = !pz.isEmpty(this.renderTo), container;
            if (!this.showLoading) {
                return;
            };

            container = this.html;
            if (pz.isEmpty(container)) {
                container = renderToDefined ? pz.dom.getEl(this.renderTo) : pz.dom.getByAttr(this.templateSelector);
            };

            if (!pz.isEmpty(container)) {
                var mask = pz.dom.findElement(container, 'div.loading-mask');
                if (!pz.isEmpty(mask)) {
                    pz.dom.remove(mask);
                    mask = null;
                };
            };

            container = null;
        },
        lastChild: function () {

            if (pz.isEmpty(this.components)) {
                return null;
            };

            return this.childAt(this.components.length - 1);
        },
        firstChild: function () {
            return this.childAt(0);
        },
        childAt: function (index) {

            if (pz.isEmpty(this.components) || pz.isEmpty(index)) {
                return null;
            };

            var childRef = this.components[index];

            if (pz.isEmpty(childRef)) {
                return null;
            };

            var childComponent = pz.getInstanceOf(childRef.id);
            return childComponent || null;
        },
        removeChild: function (component, destroy) {

            var doDestroy, compIndex;
            if (pz.isEmpty(component)) {
                return;
            };

            doDestroy = pz.isEmpty(destroy) ? true : destroy;
            compIndex = this.childIndex(component);

            if (doDestroy) {
                component.destroy();
            };

            if (compIndex != -1) {
                this.components.splice(compIndex, 1);
            };

            component = null;
        },
        childCount: function () {
            return pz.isEmpty(this.components) ? 0 : this.components.length;
        },
        childIndex: function (component) {
            var resultIdx = -1;
            if (pz.isEmpty(component)) {
                return resultIdx;
            };

            pz.arr.find(function (child, idx) {
                if (child.id == component.id) {
                    resultIdx = idx;
                };

                return child.id == component.id;
            }, this.components);

            return resultIdx;
        },
        destroy: function () {
            var me, parent;

            if (!pz.isEmpty(this.templateSelector)) {
                throw new Error(_const.canNotDestroyComponent);
            };

            me = this;

            this.publish('before-destroy', null, this);
            this.destroyChildren();
            pz.dom.off(this.html);
            if (!pz.isEmpty(this.viewModel)) {
                this.unapplyBindings();
            };
            pz.dom.remove(this.html);
            this.html = null;
            this.triggers = null;
            this.viewModel = null;
            pz.arr.clear(this.components);
            pz.arr.clear(this.handlers);
            pz.arr.clear(this.mixins);
            parent = this.traceUp();
            if (!pz.isEmpty(parent)) {
                parent.removeChild(this, false);
            };
            this.destroyed = true;
            this.base(arguments);
            this.publish('destroy-complete', null, this);
        },
        destroyChildren: function () {
            var child, instance;
            while (!pz.isEmpty(this.components) &&
                ((child = this.components[0]) != null) && !pz.isEmpty(child.id)) {

                instance = pz.getInstanceOf(child.id);
                instance.destroy();
                instance = null;
            };
        },
        addCss: function (value, el) {

            var isArray, hasClasses, html, cls;
            if (pz.isEmpty(value)) {
                return;
            };

            html = pz.isEmpty(el) ? this.html : (pz.isString(el) ?
                pz.dom.findElement(this.html, el) : el);

            if (pz.isEmpty(html)) {
                return;
            };

            isArray = pz.isArray(value);
            hasClasses = !pz.isEmpty(html.className);

            cls = isArray ? value.join(' ') : value;
            html.className += (hasClasses ? (' ' + cls) : cls);
        },
        addStyle: function (value, el) {
            var isArray, hasStyle, html, style;
            if (pz.isEmpty(value)) {
                return;
            };

            html = pz.isEmpty(el) ? this.html : (pz.isString(el) ?
                pz.dom.findElement(this.html, el) : el);

            if (pz.isEmpty(html)) {
                return;
            };

            isArray = pz.isArray(value);
            hasStyle = !pz.isEmpty(html.style.cssText);

            style = isArray ? value.join(' ') : value;
            html.style.cssText += (hasStyle ? (' ' + style) : style);
        },
        addAttr: function (value, el) {
            var html, isArray, val;
            if (pz.isEmpty(value)) {
                return;
            };

            html = pz.isEmpty(el) ? this.html : (pz.isString(el) ?
                pz.dom.findElement(this.html, el) : el);

            if (pz.isEmpty(html)) {
                return;
            };

            isArray = pz.isArray(value);
            val = isArray ? value : [value];

            pz.forEach(val, function (attr) {
                html.setAttribute(attr.name, attr.value);
            });

            val = null;
        },
        clearHtml: function () {
            pz.forEach(this.html.childNodes, function (child) {
                pz.dom.remove(child);
            }, this);
        }
    };
});

pz.define('mixin', function () {
    'use strict';

    return {
        // common mixins
    }
});
