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
        
        let p = new promise((resolve, reject) => {
            
        });

        p.handlers.push(new handler(onSuccess, onFail));
        handle(p);
        return p;
    }
    resolve(value) {
        try {
            let then = getThen(value);
            if(pz.isFunction(then)) {
                return then(this.resolve, this.reject);
            };

            this.state = this.states.RESOLVED;
            this.value = value;
            handle(this);
        } catch(e) {
            this.reject(e);
        };
    }
    reject(value) {
        this.state = this.states.REJECTED;
        this.value = value;
        handle(this);
    }
}

export default promise;