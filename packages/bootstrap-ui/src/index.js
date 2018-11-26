import base from './base/ui-base.component';
import * as components from './components/index';

const bootstrapUi = {
    init: (pz) => {
        let b = pz.base.extend(base);
        pz.forEach(components, component => {
            let def = b.extend(component);
            if(!pz.isModuleEnv()) { pz.storeDefinition(def) };
        });
    }
};

export default bootstrapUi;