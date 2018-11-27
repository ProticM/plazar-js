import base from './base/ui-base.component';
import * as components from './components/index';

const bootstrapUi = {
    init: (pz) => {
        let b = pz.component.extend(base);
        pz.storeDefinition(b.$type, b);
        pz.forEach(components.all, component => {
            let def = b.extend(component);
            pz.storeDefinition(def.$type, def);
        });
    }
};

export default bootstrapUi;