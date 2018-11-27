import base from './base/ui-base.component';
import * as components from './components/index';
import pz from '@plazarjs/core';

const bootstrapUi = {
    init: () => {
        let b = pz.component.extend(base);
        pz.storeDefinition(b.$type, b);
        pz.forEach(components.components, component => {
            let def = b.extend(component);
            pz.storeDefinition(def.$type, def);
        });
    }
};

export default bootstrapUi;