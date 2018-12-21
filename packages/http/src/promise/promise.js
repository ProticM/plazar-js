import handler from './handler';
import { resolve } from './util';

class promise {
    constructor(fn) {
        this.states = {
            pending: 0,
            resolved: 1,
            rejected: 2
        };
        this.state = this.states.pending;
        this.handlers = [];
        this.resolve(fn);
    }
    done() {

    }
    resolve(fn, promise) {
        
    }
    reject() {

    }
    success(fn) {
        this.handlers.push(new handler(fn, 'success'));
    }
    fail(fn) {
        this.handlers.push(new handler(fn, 'fail'));
    }
}

export default promise;