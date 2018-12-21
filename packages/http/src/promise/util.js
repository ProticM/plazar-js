import pz from '@plazarjs/core';

function resolve(fn, promise) {
    
};

function then(value) {
    return !pz.isEmpty(value) && (pz.isObject(value) || pz.isFunction(value)) 
        && pz.isFunction(value.then) ? value.then : null;
};

export {
    resolve,
    then 
}