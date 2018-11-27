const _http = () => {
    let _requests = {}, _const = {
        optionsRequred: 'Can not instantiate http request without options defined',
        minConfigNotProfided: 'Minimal configuration for ajax call was not provided. Please check you setup for following options [url], [method]',
        requestStates: {
            done: 4
        },
        requestStatus: {
            abort: 0
        }
    }, _types = {
        post: 'POST',
        get: 'GET',
        put: 'PUT',
        data: {
            json: 'json',
            html: 'html'
        }
    }, _createXHR = function () {
        // TODO: Add support for active x object?
        // ActiveXObject('MSXML2.XMLHTTP.3.0');
        // ActiveXObject('MSXML2.XMLHTTP');
        // ActiveXObject('Microsoft.XMLHTTP');
        return new XMLHttpRequest();
    }, _checkMinimalConfiguration = function (options) {
        // add more if needed
    
        let isOK = !pz.isEmpty(options.url) &&
            !pz.isEmpty(options.method);
    
        if (!isOK) {
            throw new Error(_const.minConfigNotProfided);
        };
    }, _configureAndInvokeXHR = function (request, options) {
        let xhr = request.xhr, callback = options.success,
            eCallback = options.fail, aCallback = options.abort,
            dataType = options.dataType || _types.data.json;
    
        xhr.onreadystatechange = function () {
    
            if (this.readyState == _const.requestStates.done
                && this.status == _const.requestStatus.abort) {
                return;
            };
    
            if (this.readyState == _const.requestStates.done && !pz.isEmpty(callback)) {
                let result = {
                    request: this,
                    data: (dataType == _types.data.json ? pz.toJSON(this.responseText) : this.responseText),
                    dataType: dataType
                };
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
    };
    
    return {
        requests: {},
        latestRequestId: null,
        request: function (options) {
    
            if (pz.isEmpty(options)) {
                throw new Error(_const.optionsRequred);
            };
    
            _checkMinimalConfiguration(options);
    
            let request = {
                id: pz.guid(),
                aborted: false,
                options: options,
                xhr: _createXHR(),
                abort: function myfunction() {
                    this.xhr.abort();
                    this.xhr = null;
                    this.aborted = true;
                }
            };
    
            this.latestRequestId = request.id;
            _configureAndInvokeXHR(request, options);
            _requests[request.id] = request;
            return request;
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
            options.method = _types.post;
            return this.request(options);
        },
        get: function (options) {
            options.method = _types.get;
            return this.request(options);
        }
    };
};

export const http = {
    init: (pz) => {
        pz.http = _http();
    }
};