import pz from '@plazarjs/core';

function _resolve(fn, promise) {
    
};

function _reject(fn, promise) {
    
};

function resolve(fn) {

};

function getThen(value) {
    return !pz.isEmpty(value) && (pz.isObject(value) || pz.isFunction(value)) 
        && pz.isFunction(value.then) ? value.then : null;
};

export {
    resolve,
    getThen
}