
const minConfigNotProfided = 'Minimal configuration for ajax call was not provided. Please check you setup for following options [url], [method]', 
    requestStates = {
        done: 4
    }, requestStatus = {
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
    },
    optionsRequred = 'Can not instantiate http request without options defined',
    headersNotAnObject = 'Headers property must be an object containing key/value pairs.';

let requests = {};

export {
    minConfigNotProfided,
    requestStates,
    requestStatus,
    types,
    optionsRequred,
    headersNotAnObject,
    requests
}