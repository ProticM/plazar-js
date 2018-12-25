import pz from '@plazarjs/core';
import factory from './factory';
import { headersNotAnObject } from './constants';

class request {
    constructor(options) {
        this.id = pz.guid();
        this.aborted = false;
        this.options = options;
        this.xhr = factory.createXHR();
    }
    abort() {
        this.xhr.abort();
        this.xhr = null;
        this.aborted = true;
    }
    setHeaders() {
        
        if(pz.isEmpty(this.options.headers)) {
            return;
        };

        if(!pz.isObject(this.options.headers)) {
            throw new Error(headersNotAnObject);
        };

        let headerKeys = Object.keys(this.options.headers);
        pz.forEach(headerKeys, (key) => {
            this.xhr.setRequestHeader(key, this.options.headers[key]);
        }, this);
    }
}

export default request;