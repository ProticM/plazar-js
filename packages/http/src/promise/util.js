import pz from '@plazarjs/core';

const states = {
    PENDING: 0,
    RESOLVED: 1,
    REJECTED: 2
};

let resolve = (fn, promise) => {
    try {
        fn(promise.resolve.bind(promise), promise.reject.bind(promise));
    } catch(e) {
        promise.reject(e);
    };
};

let getThen = (value) => {
    return !pz.isEmpty(value) && (pz.isObject(value) || pz.isFunction(value)) 
        && pz.isFunction(value.then) ? value.then : null;
};

let handle = (promise) => {
    if (promise.state == states.PENDING) {
        return null;
    };
  
    promise.handlers.forEach((handler) => {
        if (promise.state == states.REJECTED) {
            return handler.onFail(promise.value);
        };

        return handler.onSuccess(promise.value);
    });

    pz.arr.clear(promise.handlers);
};

let setResult = (promise, value, state) => {
    setTimeout(() => {
        try {
            if (promise.state != states.PENDING) {
                return null;
            };
    
            let then = getThen(value);
            if(pz.isFunction(then)) {
                return then(promise.resolve, promise.reject);
            };
    
            promise.state = state;
            promise.value = value;
            return handle(promise);
        } catch(e) {
            return promise.reject(e);
        };
    }, 0);
};

export {
    resolve,
    handle,
    setResult,
    states
}