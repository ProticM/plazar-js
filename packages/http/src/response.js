import pz from '@plazarjs/core';
import { types, requestStatus } from './constants';

class response {
    constructor(request, dataType) {
        this.request = request;
        let dt = request.status == requestStatus.ok && !pz.isEmpty(dataType) ? dataType.toLowerCase() : 'text';
        this.data = (dt == types.data.json ? pz.toJSON(request.responseText) : request.responseText);
        this.dataType = dt;
    }
}

export default response;