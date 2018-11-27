import base from './base/ui-base.component';
import * as components from './components';
import pz from '@plazarjs/core';

const bootstrapUi = {
    init: () => {
        let b = pz.component.extend(base);
        pz.storeDefinition(b.$type, b);
        for(let component in components) {
            let def = b.extend(components[component]);
            pz.storeDefinition(def.$type, def);
        };
    }
};

export default bootstrapUi;