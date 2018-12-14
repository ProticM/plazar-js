import pz from '../../core';
import reservedKeys from './reserved-keys';
import { buildContext, pathToParts } from './util';

class binding {
    _parseAlias(keypath) {
        let as = keypath.indexOf(reservedKeys.as) != -1,
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
    constructor(el, type, keypath, bindingAttr, view) {
        let result = this._parseAlias(keypath);

        this.id = pz.guid();
        this.el = el;
        this.view = view;
        this.type = type;
        this.keypath = result.keypath.trim();
        this.prop = pathToParts(result.keypath).pop();
        this.alias = type == 'each' && !pz.isEmpty(result.alias) ? 
            { name: result.alias, path: (this.prop + '[{0}]') } : null;
        this.bindingAttr = bindingAttr;
        this.rootVm = view.vm;
        this.vm = buildContext(result.keypath, view);
        this.binder = pz.binder.binders[this.type];
        this.handler = this.binder.handler ? pz.proxy(this.binder.handler, this) : undefined;
        view = null;
        return this;
    };
    bind() {

        let observer = this.vm[this.prop];
    
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
    unbind() {
        let observer = this.vm[this.prop];
        if (observer && observer.unsubscribe) {
            observer.unsubscribe(this.id);
        };
        if (pz.isFunction(this.binder.unbind)) {
            this.binder.unbind.call(this);
        };
    };
    getValue() {

        let prop, isFn;
    
        if (this.prop == reservedKeys.current) {
            return this.vm;
        };
    
        if (this.prop == reservedKeys.idx) {
            return this.view.index;
        };
    
        prop = this.vm[this.prop];
        isFn = pz.isFunction(prop);
        return isFn ? this.vm[this.prop].call(this) : this.vm[this.prop];
    };
    setValue(value) {
        return this.vm[this.prop] = value;
    };
};

export default binding;