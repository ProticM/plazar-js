import handler from './handler';
import { resolve, handle } from './util';

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
        resolve(fn);
    }
    done() {
        handle(this);
    }
    then(onSuccess, onFail) {
        
        let promise = new promise((resolve, reject) => {
            
        });

        promise.handlers.push(new handler(onSuccess, onFail));
        return promise;
    }
    resolve(value) {
        this.state = this.states.REJECTED;
        this.value = value;
    }
    reject(value) {
        this.state = this.states.RESOLVED;
        this.value = value;
    }
}

export default promise;