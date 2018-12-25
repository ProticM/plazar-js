﻿import pz from '@plazarjs/core';
import { checkMinimalConfiguration, configureAndInvokeXHR, types } from './util';
import request from './request';

const pzHttp = () => {

    let _requests = {};
    const _optionsRequred = 'Can not instantiate http request without options defined';
    
    return {
        requests: {},
        latestRequestId: null,
        request: function (options) {
    
            if (pz.isEmpty(options)) {
                throw new Error(_optionsRequred);
            };
    
            checkMinimalConfiguration(options);
    
            let req = new request(options);
    
            this.latestRequestId = request.id;
            configureAndInvokeXHR(request, options);
            _requests[req.id] = req;
            return req;
        },
        abort: function (all) {
            let abortAll = all || false, requestIds;
            let requestToAbort = abortAll ? _requests : 
                _requests[this.latestRequestId];
    
            if (pz.isEmpty(requestToAbort)) {
                return;
            };
    
            if (!abortAll) {
                requestToAbort.abort();
                delete _requests[this.latestRequestId];
                this.latestRequestId = null;
                return;
            };
    
            requestIds = Object.keys(requestToAbort);
            pz.forEach(requestIds, function (id) {
                let request = _requests[id];
                request.abort();
                delete _requests[id];
                request = null;
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