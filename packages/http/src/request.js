import pz from '@plazarjs/core';
import factory from './factory';
import { notAnObject } from './constants';

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
    setHeaders(headers) {
        let h = pz.isEmpty(headers) ? this.options.headers : headers;

        if(pz.isEmpty(h)) {
            return;
        };

        if(!pz.isObject(h)) {
            throw new Error(pz.str.format(notAnObject, '[headers]'));
        };

        let headerKeys = Object.keys(h);
        pz.forEach(headerKeys, (key) => {
            this.xhr.setRequestHeader(key, h[key]);
        });
    }
    setXHROptions(options) {
        let o = pz.isEmpty(options) ? this.options : options;

        this.xhr.withCredentials = o.withCredentials || false;
        this.xhr.timeout = o.timeout || 0;
    }
    parseUrlParams(params) {
        let p = pz.isEmpty(params) ? this.options.params : params;

        if(pz.isEmpty(p)) {
            return;
        };

        if(!pz.isObject(p)) {
            throw new Error(pz.str.format(notAnObject, '[params]'));
        };

        this.options.url = this.options.url.replace(/\{(.*?)\}/g, (pattern, value) => {
            return p[value];
        })
    }
}

export default request;