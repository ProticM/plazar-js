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
        this.value = null;
        resolve(fn);
    }
    done() {

    }
    then(success, fail) {
        this.handlers.push(new handler(fn, 'success'));
    }
}

export default promise;