import base from './base/ui-base.component';
import * as components from './components';
import pz from '@plazarjs/core';

const bootstrapUi = {
    init: () => {
        pz.storeDefinition(base.$type, base);
        for(let component in components) {
            let def = components[component];
            pz.storeDefinition(def.$type, def);
        };
    }
};

export default bootstrapUi;