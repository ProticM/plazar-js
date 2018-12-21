import handler from './handler';
import { resolve, handle, getThen } from './util';

class promise {
    constructor(fn) {
        this.states = {
            PENDING: 0,
            RESOLVED: 1,
            REJECTED: 2
        };
        this.state = this.states.PENDING;
        this.handlers = [];
        this.value = null;
        resolve(fn, this);
    }
    done() {
        let me = this;
        setTimeout(() => {
            handle(me);
        }, 0);
    }
    then(onSuccess, onFail) {
        let me = this;
        return new promise((resolve, reject) => {
            me.handlers.push(new handler((value) => {
                
                if(pz.isEmpty(onSuccess)) {
                    return resolve(value);
                };

                try {
                    return resolve(onSuccess(value));
                } catch (e) {
                    return reject(e);
                };
            }, (value) => {

                if(pz.isEmpty(onFail)) {
                    return resolve(value);
                };

                try {
                    return resolve(onFail(value));
                } catch (e) {
                    return reject(e);
                };
            }));

            return handle(me);
        });
    }
    resolve(value) {
        try {
            let then = getThen(value);
            if(pz.isFunction(then)) {
                return then(this.resolve, this.reject);
            };

            this.state = this.states.RESOLVED;
            this.value = value;
            return handle(this);
        } catch(e) {
            return this.reject(e);
        };
    }
    reject(value) {
        this.state = this.states.REJECTED;
        this.value = value;
        return handle(this);
    }
}

export default promise;