import pz from '../../core';
import reservedKeys from './reserved-keys';
import { buildContext, pathRegex } from './util';

const textParser = {
    parse: function (el) {

        let hasInterpolations,
            keypaths, updateContent, elData;

        if (el.nodeType != 3 || el.textContent.length == 0) {
            return;
        };

        hasInterpolations = (el.textContent.indexOf(pz.binder.delimiters[0]) != -1 &&
            el.textContent.indexOf(pz.binder.delimiters[1]) != -1);

        if (!hasInterpolations) {
            return;
        };

        keypaths = [];

        updateContent = (function (me, _vm) {
            return function (data, parsed) {
                data.el.textContent = data.tpl.replace(/{([^}]*)}/g, function (template, value) {
                    let isPath, val, vmValue, curr, idx;

                    value = value.replace(/ +?/g, '');
                    curr = value.indexOf(reservedKeys.current) != -1;
                    idx = value.indexOf(reservedKeys.idx) != -1;
                    vmValue = (!curr ? (!idx ? _vm[value] : me.index) : _vm);
                    isPath = pathRegex.test(value);

                    if (isPath) {
                        val = value.split('.').pop();
                        vmValue = ((me.ctx && me.ctx[val]) || me.vm[val]) ||
                            buildContext(value, me)[val];
                        val = null;
                    };

                    if (!parsed) {
                        keypaths.push(value);
                    };

                    let result = (!pz.isEmpty(vmValue) ?
                        (pz.isFunction(vmValue) ? vmValue() : vmValue) : template);
                    vmValue = null;
                    return result;
                });
            };
        })(this, this.ctx || this.vm);

        if (!this.elsData) {
            this.elsData = [];
        };

        elData = {
            el: el,
            tpl: el.textContent.trim()
        };

        this.elsData.push(elData);
        updateContent(elData, false);

        (function (me, elsData) {
            pz.forEach(keypaths, function (keypath) {
                let ctx = buildContext(keypath, me);
                let prop = keypath.split('.').pop();
                let observer = ctx[prop];
                if (observer && observer.subscribe) {
                    observer.subscribe(function () {
                        pz.forEach(elsData, function (data) {
                            updateContent(data, true);
                        });
                    });
                };
                ctx = null;
            });
        })(this, this.elsData);

        keypaths.splice(0, keypaths.length);
        this.elsData.splice(0, keypaths.length);
    }
};

export default textParser;