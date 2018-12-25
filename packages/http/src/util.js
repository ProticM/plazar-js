import pz from '@plazarjs/core';
import response from './response';

const _minConfigNotProfided = 'Minimal configuration for ajax call was not provided. Please check you setup for following options [url], [method]', 
    _requestStates = {
        done: 4
    }, _requestStatus = {
        abort: 0
    }, types = {
        post: 'POST',
        get: 'GET',
        put: 'PUT',
        delete: 'DELETE',
        data: {
            json: 'json',
            html: 'html'
        }
    };

let createXHR = () => {
    // TODO: Add support for active x object?
    // ActiveXObject('MSXML2.XMLHTTP.3.0');
    // ActiveXObject('MSXML2.XMLHTTP');
    // ActiveXObject('Microsoft.XMLHTTP');
    return new XMLHttpRequest();
};

let checkMinimalConfiguration = (options) => {
    // add more if needed

    let isOK = !pz.isEmpty(options.url) &&
        !pz.isEmpty(options.method);

    if (!isOK) {
        throw new Error(_minConfigNotProfided);
    };
};

let configureAndInvokeXHR = function (request, options) {
    let xhr = request.xhr, callback = options.success,
        eCallback = options.fail, aCallback = options.abort,
        dataType = options.dataType || types.data.json;

    xhr.onreadystatechange = function () {

        if (this.readyState == _requestStates.done
            && this.status == _requestStatus.abort) {
            return;
        };

        if (this.readyState == _requestStates.done && !pz.isEmpty(callback)) {
            let result = new response(this, dataType);
            callback.call(this, result);
            delete _requests[request.id];
        };
    };

    xhr.onerror = function (e) {
        delete _requests[request.id];

        if (eCallback) {
            eCallback(e.target);
        } else {
            throw new Error(e.target.statusText);
        };
    };

    xhr.onabort = function (e) {
        if (aCallback) {
            aCallback(e);
        };
    };

    xhr.open(options.method, options.url, true);

    if (pz.isString(options.data)) {
        options.data = pz.toJSON(options.data);
    };

    xhr.send(options.data || null);
}

export {
    createXHR,
    checkMinimalConfiguration,
    configureAndInvokeXHR,
    types
}