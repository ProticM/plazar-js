import pz from '@plazarjs/core';

function resolve(fn, promise) {
    try {
        fn.call(this, promise.resolve.bind(promise), promise.reject, promise.resolve.bind(promise));
    } catch(e) {
        promise.reject(e);
    };
};

function getThen(value) {
    return !pz.isEmpty(value) && (pz.isObject(value) || pz.isFunction(value)) 
        && pz.isFunction(value.then) ? value.then : null;
};

function handle(promise) {
    if (promise.state === promise.states.PENDING) {
        return null;
    };
  
    promise.handlers.forEach((handler) => {
        if (promise.state === promise.states.REJECTED) {
            return handler.onFail(promise.value);
        };

        return handler.onSuccess(promise.value);
    });

    pz.arr.clear(promise.handlers);
};

export {
    resolve,
    getThen,
    handle
}