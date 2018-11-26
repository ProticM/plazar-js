import base from './base';
import * as components from './components';
import * as mixins from './mixins';

const bootstrapUi = {
    init: (pz) => {
        components.forEach(component => {
            let def = base.extend(component);
            if(!pz.isModuleEnv()) { pz.storeDefinition(def) };
        });
    }
};

export default bootstrapUi;