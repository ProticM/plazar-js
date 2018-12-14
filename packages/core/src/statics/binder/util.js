import pz from '../../core';
import reservedKeys from './reserved-keys';

let pathRegex = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, 
    backslashRegex = /\\(\\)?/g; // these are used by lodash to parse the path

let getAliasRegex = (keys) => { // alias regex
    return new RegExp('\\b' + keys.join('|') + '\\b', 'gi');
};

let pathToParts = (keypath) => {
    let result = [];
    keypath.replace(pathRegex, function(match, num, quote, str) {
        result.push(!pz.isEmpty(quote) ? str.replace(backslashRegex, '$1') : (num || match));
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
    let aliases = Object.keys(view.alias), hasAlias = aliases.length > 0,
        isPath = pathRegex.test(keypath),
        fromRoot = isPath && keypath.indexOf(reservedKeys.root) != -1, 
        parts, aliasRegex;

    keypath = fromRoot ? keypath.replace((reservedKeys.root), '') : keypath;
    if(hasAlias) {
        aliasRegex = getAliasRegex(aliases);
        keypath = keypath.replace(aliasRegex, function(matched){
            return view.alias[matched];
        });
    };
    parts = pathToParts(keypath);
    return parseKeyPath(parts, ctx) || parseKeyPath(parts, vm);
};

export {
    buildContext,
    parseKeyPath,
    pathToParts,
    pathRegex
};