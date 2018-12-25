import pz from '@plazarjs/core';
import { types, optionsRequred, requests } from './constants';
import factory from './factory';
import request from './request';

const pzHttp = () => {

    return {
        latestRequestId: null,
        request: function (options) {
    
            if (pz.isEmpty(options)) {
                throw new Error(optionsRequred);
            };
    
            factory.checkMinimalConfiguration(options);
    
            let req = new request(options);
    
            this.latestRequestId = req.id;
            factory.configureAndInvokeXHR(req, options);
            requests[req.id] = req;
            return req;
        },
        abort: function (all) {
            let abortAll = all || false, requestIds;
            let requestToAbort = abortAll ? requests : 
            requests[this.latestRequestId];
    
            if (pz.isEmpty(requestToAbort)) {
                return;
            };
    
            if (!abortAll) {
                requestToAbort.abort();
                delete requests[this.latestRequestId];
                this.latestRequestId = null;
                return;
            };
    
            requestIds = Object.keys(requestToAbort);
            pz.forEach(requestIds, function (id) {
                let req = requests[id];
                req.abort();
                delete requests[id];
                req = null;
            }, this);
    
            requestToAbort = null;
            this.latestRequestId = null;
        },
        post: function (options) {
            options.method = types.post;
            return this.request(options);
        },
        get: function (options) {
            options.method = types.get;
            return this.request(options);
        },
        put: function (options) {
            options.method = types.put;
            return this.request(options);
        },
        delete: function (options) {
            options.method = types.delete;
            return this.request(options);
        }
    };
};

export default {
    init: () => {
        pz.http = pzHttp();
    }
};