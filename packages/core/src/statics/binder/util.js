import pz from '../../core';
import reservedKeys from './reserved-keys';
// /^[a-z$][a-z0-9]*(?:\.[a-z0-9]+)+$/i // this one mathes only dotted keypath
let pathRegex = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g; // this one is used by lodash to parse the path

let pathToParts = (keypath) => {
    let result = [];
    keypath.replace(pathRegex, function(match, num, quote, str) {
        result.push(!pz.isEmpty(quote) ? str : (num || match));
    });
    return result;
};

let parseKeyPath = function (parts, target) {
    let globalScope = pz.getGlobal(), result, p;

    if (parts.length == 1) {
        return ((!pz.isEmpty(target) && 
            !pz.isEmpty(target[parts[0]])) || 
                pz.arr.contains([reservedKeys.idx, reservedKeys.current], parts[0])) ? 
                    target : null;
    };

    p = parts.slice();
    p.pop();
    result = p.reduce(function (previous, current) {
        let isString = pz.isString(previous);
        return isString ? globalScope[previous][current] :
            (pz.isEmpty(previous) ? null : previous[current]);
    }, target);
    
    return result;
};

let buildContext = function (keypath, view) {
    let ctx = view.ctx, vm = view.vm;
    let hasAlias = Object.keys(view.alias).length > 0,
        isPath = pathRegex.test(keypath),
        fromRoot = isPath && keypath.indexOf(reservedKeys.root) != -1, parts;

    keypath = fromRoot ? keypath.split('.').slice(1).join('.') : keypath;
    parts = pathToParts(keypath);
    return parseKeyPath(parts, ctx) || parseKeyPath(parts, (hasAlias ? view.alias : undefined)) || parseKeyPath(parts, vm);
};

export {
    buildContext,
    parseKeyPath,
    pathRegex
};