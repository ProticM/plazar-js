import base from './base/ui-base.component';
import * as components from './components/index';

const bootstrapUi = {
    init: (pz) => {
        pz.forEach(components, component => {
            let def = base.extend(component);
            if(!pz.isModuleEnv()) { pz.storeDefinition(def) };
        });
    }
};

export default bootstrapUi;