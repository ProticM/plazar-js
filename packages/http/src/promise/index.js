import handler from './handler';
import { doResolve, handle, states } from './util';

class promise {
    constructor(fn) {
        this.state = states.PENDING;
        this.handlers = [];
        this.value = null;
        doResolve(fn, this);
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
}

export default promise;