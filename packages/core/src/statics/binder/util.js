import pz from '../../core';
import reservedKeys from './reserved-keys';

let parseKeyPath = function (keypath, target) {

    let parts = keypath.split('.');
    let globalScope;

    if (parts.length == 1) {
        return target;
    };
    
    globalScope = pz.getGlobal();
    parts.pop();
    return parts.reduce(function (previous, current) {
        let isString = pz.isString(previous);
        return isString ? globalScope[previous][current] :
            (pz.isEmpty(previous) ? null : previous[current]);
    }, target);
};

let buildContext = function (keypath, view) {
    let ctx = view.ctx, vm = view.vm;
    let hasCtx = ctx != null,
        isPath = /^[a-z$][a-z0-9]*(?:\.[a-z0-9]+)+$/i.test(keypath),
        fromRoot = isPath && keypath.indexOf(reservedKeys.root) != -1;

    keypath = fromRoot ? keypath.split('.').slice(1).join('.') : keypath;

    return (hasCtx && !isPath && !fromRoot ? ctx : parseKeyPath(keypath, vm)) ||
        parseKeyPath(keypath, ctx);
};

export {
    buildContext,
    parseKeyPath
};