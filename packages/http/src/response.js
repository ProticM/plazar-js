import pz from '@plazarjs/core';
import { types } from './constants';

class response {
    constructor(request, dataType) {
        this.request = request;
        this.data = (dataType == types.data.json ? pz.toJSON(this.responseText) : this.responseText),
        this.dataType = dataType;
    }
}

export default response;