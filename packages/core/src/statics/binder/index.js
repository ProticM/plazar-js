import pz from '../../core';
import { observableArray, observe } from './observableArray';
import view from './view';
import reservedKeys from './reserved-keys';

const binder = {
    prefix: 'data',
    delimiters: ['{', '}'],
    bind: function (els, viewModel) {

        if (viewModel.$view) {
            viewModel.$view.bind();
            return;
        };

        observe(viewModel);
        let v = new view(els, viewModel);
        v.bind();
        viewModel.$view = v;
        v = null;
    },
    unbind: function (viewModel) {
        if (viewModel.$view) {
            viewModel.$view.unbind();
        };
    },
    toJSON: function (viewModel) {
        let getProperties = function (value) {
            return Object.keys(value).filter(function (key) {
                return key != reservedKeys.observed && key != reservedKeys.view;
            })
        }, toJSON = function (value, res) {

            let properties = getProperties(value);

            pz.forEach(properties, function (prop) {

                let isObject = pz.isObject(value[prop]),
                    isFunction = pz.isFunction(value[prop]),
                    isObsArray = pz.isInstanceOf(value[prop], observableArray);

                if (isObject) {
                    res[prop] = toJSON(value[prop], {});
                };

                if (isObsArray) {
                    res[prop] = [];
                    let dataKeys = Object.keys(value[prop]).filter(function (key) {
                        return !isNaN(parseInt(key));
                    });

                    pz.forEach(dataKeys, function (key) {
                        let item = value[prop][key];
                        let val = (pz.isObject(item) ? toJSON(item, {}) :
                            (pz.isFunction(item) ? item() : item));
                        res[prop].push(val);
                    });
                };

                if (isFunction && !pz.isEmpty(value[prop].subscribe)) {
                    res[prop] = value[prop]();
                };
            });

            return res;
        };

        return toJSON(viewModel, {});
    },
    binders: {
        'value': {
            priority: 3,
            bind: function () {

                let isInput = this.el.nodeName == 'INPUT',
                    isOption = this.el.nodeName == 'OPTION',
                    isSelect = this.el.nodeName == 'SELECT',
                    isTextArea = this.el.nodeName == 'TEXTAREA',
                    event, isText, globalScope;

                if (!isInput && !isOption && !isSelect && !isTextArea) {
                    throw new Error('Value binding is supported only on INPUT, OPTION or SELECT element');
                };

                globalScope = pz.getGlobal();
                event = isInput || isTextArea ? (('oninput' in globalScope) ? 'input' : 'keyup') : 'change';
                isText = isInput && this.el.type == 'text' || isTextArea;

                if ((isSelect || isText) && pz.isFunction(this.handler)) {
                    this.el.removeEventListener(event, this.handler, false);
                    this.el.addEventListener(event, this.handler, false);
                    this.event = event;
                };

                this.el.removeAttribute(this.bindingAttr);
            },
            react: function () {

                let isInput = this.el.nodeName == 'INPUT',
                    isSelect = this.el.nodeName == 'SELECT',
                    isTextArea = this.el.nodeName == 'TEXTAREA',
                    isText = isInput && this.el.type == 'text';

                if (isText || isSelect || isTextArea) {
                    this.el.value = this.getValue();
                } else {
                    this.el.setAttribute('value', this.getValue());
                };
            },
            handler: function () {
                this.setValue(this.el.value);
            },
            unbind: function () {
                this.el.removeEventListener(this.event, this.handler, false);
            }
        },
        'each': {
            priority: 1,
            block: true,
            bind: function () {

                if (!this.mark) {
                    this.mark = document.createComment('each:' + this.id);
                    this.el.removeAttribute(this.bindingAttr);
                    this.el.parentNode.insertBefore(this.mark, this.el);
                    this.el.parentNode.removeChild(this.el);
                };

                if (!this.views) {
                    this.views = [];
                };
            },
            react: function () {

                let value = this.getValue(), template;

                pz.forEach(this.views, function (view) {
                    view.unbind();
                    pz.forEach(view.els, function (el) {
                        el.parentNode.removeChild(el);
                        el = null;
                    });
                    view.els.splice(0, view.els.length);
                });

                this.views.splice(0, this.views.length);

                pz.forEach(value, function (item, idx) {
                    template = this.el.cloneNode(true);
                    let v = new view(template, this.rootVm, item, idx, this.alias, this.view);
                    v.bind();
                    this.mark.parentNode.insertBefore(template, this.mark);
                    this.views.push(v);
                }, this);
            },
            unbind: function () {
                pz.forEach(this.views, function (view) {
                    view.unbind();
                });
            }
        },
        'text': {
            priority: 3,
            bind: function () {
                this.el.removeAttribute(this.bindingAttr);
            },
            react: function () {
                let hasInnerText = this.el.hasOwnProperty('innerText');
                this.el[hasInnerText ? 'innerText' : 'innerHTML'] = this.getValue();
            }
        },
        'if': {
            priority: 2,
            bind: function (val) {
                let value = val != undefined ? val : this.getValue();
                this.el.removeAttribute(this.bindingAttr);

                if (!value && !pz.isEmpty(this.el.parentNode)) {
                    this.el.parentNode.removeChild(this.el);
                };
            }
        },
        'ifnot': {
            priority: 2,
            bind: function () {
                let value = this.getValue();
                pz.binder.binders.if.bind.call(this, !value);
            }
        },
        'visible': {
            priority: 2,
            bind: function () {
                this.el.removeAttribute(this.bindingAttr);
            },
            react: function (val) {
                let value = val != undefined ? val : this.getValue();

                if (this.initialValue == undefined) {
                    this.initialValue = this.el.style.display;
                };

                this.el.style.display = (value == true ?
                    (this.initialValue == 'none' ? '' : this.initialValue) : 'none');
            }
        },
        'hidden': {
            bind: function () {
                pz.binder.binders.visible.bind.call(this);
            },
            react: function () {
                let value = this.getValue();
                pz.binder.binders.visible.react.call(this, !value);
            }
        },
        'html': {
            bind: function () {
                this.el.removeAttribute(this.bindingAttr);
            },
            react: function () {
                this.el.innerHTML = this.getValue();
            }
        },
        'attr': {
            priority: 2,
            bind: function () {
                this.el.removeAttribute(this.bindingAttr);
            },
            react: function () {
                let isClassAttr = (this.attrToBind == 'class');
                let value = this.getValue();

                if (isClassAttr && this.el.hasAttribute(this.attrToBind)) {
                    value = (this.el.getAttribute(this.attrToBind) + ' ' + value).trim();
                };

                this.el.setAttribute(this.attrToBind, value.toString());
            }
        },
        'checked': {
            bind: function () {
                this.el.removeEventListener('change', this.handler, false);
                this.el.addEventListener('change', this.handler, false);
                this.event = 'change';
                this.el.removeAttribute(this.bindingAttr);
            },
            react: function () {
                let isRadio = this.el.type == 'radio',
                    value = this.getValue();

                if (isRadio) {
                    this.el.checked = value == this.el.value;
                } else {
                    this.el.checked = value;
                };
            },
            handler: function () {
                let isRadio = this.el.type == 'radio';
                this.setValue((isRadio ? this.el.value : this.el.checked));
            },
            unbind: function () {
                this.el.removeEventListener(this.event, this.handler, false);
            }
        },
        'enabled': {
            bind: function () {
                this.el.removeAttribute(this.bindingAttr);
            },
            react: function () {
                let value = this.getValue();
                this.el.disabled = !value;
            }
        },
        'options': {
            priority: 1,
            block: true,
            tempAttrs: {
                val: null,
                text: null
            },
            bind: function () {

                this.el.removeAttribute(this.bindingAttr);

                if (!this.views) {
                    this.views = [];
                };

                this.binder.tempAttrs.val = this.binder.tempAttrs.val || this.el.getAttribute('data-optionsvalue');
                this.binder.tempAttrs.text = this.binder.tempAttrs.text || this.el.getAttribute('data-optionstext');
                this.el.removeAttribute('data-optionsvalue');
                this.el.removeAttribute('data-optionstext');
            },
            react: function () {
                let value = this.getValue();

                pz.forEach(this.views, function (view) {
                    view.unbind();
                    pz.forEach(view.els, function (el) {
                        el.parentNode.removeChild(el);
                        el = null;
                    });
                    view.els.splice(0, view.els.length);
                });

                this.views.splice(0, this.views.length);

                pz.forEach(value, function (item, idx) {
                    let template = document.createElement('option');
                    template.setAttribute('data-value', this.binder.tempAttrs.val);
                    template.setAttribute('data-text', this.binder.tempAttrs.text);

                    let v = new view(template, this.rootVm, item, idx, this.alias, this.view);
                    v.bind();
                    this.el.appendChild(template);
                    this.views.push(v);
                    template = null;
                }, this);
            },
            unbind: function () {
                pz.forEach(this.views, function (view) {
                    view.unbind();
                });
            }
        },
        'on': {
            priority: 1,
            bind: function() {
                this.el.removeAttribute(this.bindingAttr);
                this.event = this.attrToBind;
                this.capture = ['blur', 'focus', 'focusout', 'focusin'].indexOf(this.event) != -1;
                this.el.addEventListener(this.attrToBind, this.handler, this.capture);
            },
            unbind: function() {
                this.el.removeEventListener(this.attrToBind, this.handler, this.capture);
            },
            handler: function() {
                let value = this.getValue();

                if(!pz.isEmpty(value)) { 
                    value.call(this, this.el);
                };
            }
        }
    }
};

export default binder;