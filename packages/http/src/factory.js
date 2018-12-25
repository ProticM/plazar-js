import pz from '@plazarjs/core';
import response from './response';
import { minConfigNotProfided, requestStates, requestStatus } from './constants';


class factory {
    static createXHR() {
        // TODO: Add support for active x object?
        // ActiveXObject('MSXML2.XMLHTTP.3.0');
        // ActiveXObject('MSXML2.XMLHTTP');
        // ActiveXObject('Microsoft.XMLHTTP');
        return new XMLHttpRequest();
    }
    static checkMinimalConfiguration(options) {
        // add more if needed

        let isOK = !pz.isEmpty(options.url) && 
            !pz.isEmpty(options.method);

        if (!isOK) {
            throw new Error(minConfigNotProfided);
        };
    }
    static configureAndInvokeXHR(request, options) {
        let xhr = request.xhr, callback = options.success,
            eCallback = options.fail, aCallback = options.abort,
            dataType = options.dataType || types.data.json;
    
        xhr.onreadystatechange = function () {
    
            if (this.readyState == requestStates.done
                && this.status == requestStatus.abort) {
                return;
            };
    
            if (this.readyState == requestStates.done && !pz.isEmpty(callback)) {
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
}

export default factory;