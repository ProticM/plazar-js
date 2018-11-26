import pz from './core/plazar-core';
import base from './components/base/plazar-base';
import cls from './components/plazar-class';
import component from './components/plazar-component';
import mixin from './components/plazar-mixin';
import binder from './statics/plazar-binder';
import dom from './statics/plazar-dom';
import events from './statics/plazar-events';
import objectUtils from './utils/object';
import arrayUtils from './utils/array';
import stringUtils from './utils/string';

pz.obj = objectUtils;
pz.arr = arrayUtils;
pz.str = stringUtils;
pz.binder = binder();
pz.dom = dom();
pz.events = events();
pz.base = base;
pz.component = base.extend(component);
pz.class = base.extend(cls);
pz.mixin = base.extend(mixin);

export default pz;