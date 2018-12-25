import pz from '@plazarjs/core';
import { createXHR } from './util';

class request {
    constructor(options) {
        this.id = pz.guid();
        this.aborted = false;
        this.options = options;
        this.xhr = createXHR();
    }
    abort() {
        this.xhr.abort();
        this.xhr = null;
        this.aborted = true;
    }
}

export default request;