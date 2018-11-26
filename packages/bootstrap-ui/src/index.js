import base from './base/ui-base.component';
import * as components from './components/index';

const bootstrapUi = {
    init: (pz) => {
        let b = pz.component.extend(base);
        if(!pz.isModularEnv()) { pz.storeDefinition(b.$type, b) };
        pz.forEach(components.all, component => {
            let def = b.extend(component);
            if(!pz.isModularEnv()) { pz.storeDefinition(def.$type, def) };
        });
    }
};

export default bootstrapUi;