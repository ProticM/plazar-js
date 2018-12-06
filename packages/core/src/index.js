import pz from './core';
import base from './asset-types/base';
import cls from './asset-types/class';
import component from './asset-types/component';
import mixin from './asset-types/mixin';
import binder from './statics/binder';
import dom from './statics/dom';
import events from './statics/events';
import objectUtils from './utils/object';
import arrayUtils from './utils/array';
import stringUtils from './utils/string';

pz.obj = objectUtils;
pz.arr = arrayUtils;
pz.str = stringUtils;
pz.binder = binder;
pz.dom = dom();
pz.events = events();
pz.base = base;
pz.component = base.extend(component);
pz.class = base.extend(cls);
pz.mixin = base.extend(mixin);

export default pz;