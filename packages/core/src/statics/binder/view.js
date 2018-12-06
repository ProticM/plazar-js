import pz from '../../core';
import textParser from './parser';
import binding from './binding';

let bindingRegex;

let getBindingRegex = function () {
    if (pz.isEmpty(bindingRegex)) {
        bindingRegex = RegExp('^' + pz.binder.prefix + '-', 'i');
    };

    return bindingRegex;
};

let parseAttrName = function (name) {
    let startIdx, endIdx;
    let inBrackets = ((startIdx = name.indexOf('[')) != -1) &&
        ((endIdx = name.indexOf(']')) != -1), attrToBind, parts;

    if (!inBrackets) {
        return name.split('-');
    };

    attrToBind = name.substring((startIdx + 1), endIdx);
    name = name.replace('-[' + attrToBind + ']', '');
    parts = name.split('-');
    parts.push(attrToBind);
    return parts;
};

class view {
    constructor(el, vm, ctx, index) {
        this.els = pz.isArray(el) || pz.isNodeList(el) ? el : [el];
        this.vm = vm;
        this.ctx = ctx || null;
        this.index = !pz.isEmpty(index) ? index : null;
        this.buildBindings();
        vm = null;
        return this;
    };
    bind() {
        pz.forEach(this.bindings, function (binding) {
            binding.bind();
        });
    };
    unbind() {
        pz.forEach(this.bindings, function (binding) {
            binding.unbind();
        });
    };
    buildBindings() {
        this.bindings = [];
    
        let build = (function (me) {
            return function (els) {
                pz.forEach(els, function (el) {
                    let isBlock = (el.hasAttribute && el.hasAttribute(pz.binder.prefix + '-each')),
                        attrs = isBlock ? [el.getAttributeNode(pz.binder.prefix + '-each')] : (el.attributes || []);
    
                    pz.forEach(attrs, function (attr) {
                        if (getBindingRegex().test(attr.name)) {
                            let parts = parseAttrName(attr.name);
                            let bType = parts[1], attrToBind = parts[2];
    
                            if (!pz.isEmpty(pz.binder.binders[bType])) {
                                let b = new binding(el, bType.toLowerCase(), attr.value, attr.name, me);
                                if (attrToBind) { b.attrToBind = attrToBind; };
    
                                me.bindings.push(b);
                                isBlock = isBlock || b.binder.block;
                                b = null;
                            };
                        };
                    });
    
                    if (!isBlock) {
                        pz.forEach(el.childNodes, function (childNode) {
                            build([childNode]);
                            textParser.parse.call(me, childNode);
                        });
                    };
                });
            };
        })(this);
    
        build(this.els);
        this.bindings.sort(function (a, b) {
            return a.binder.priority - b.binder.priority;
        });
    };
};

export default view;