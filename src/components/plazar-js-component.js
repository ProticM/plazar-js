plz.define('component', function () {
    'use strict';

    var _const = {
        tplSourceNotDefined: 'Template source not defined. Please define one of these options in your component config: 1. [template]; 2. [templateSelector]; 3. [ajaxSetup.url]',
        tplContainerNotDefined: 'Template container selector not defined. Please define one of these options in your component config: 1. [renderTo]; 2. [templateSelector];',
        tplContainerNotFound: 'Template container not found. Please review one of these options in your component config: 1. [renderTo]; 2. [templateSelector];',
        loadingMaskMarkup: '<div class="loading-mask" style="color:#fff;background-color: #fff;position:absolute;top:0;left:0;bottom:0;width:100%;text-align:center;vertical-align:middle;height:100%">'
            .concat('<p style="position: absolute;top:40%;left:41.5%;background-color: #fff;padding: 5px;border: 1px solid #f1f1f1;color: #c0c0c0;z-index:1">loading...</p></div>'),
        addChildParamErr: 'Component you\'re trying to add, or it\'s [type] property has not been provided via parameter for [addChild] function. Example invocation: parent.addChild({ type: \'myType\' })',
        renderBeforeAndAfterDefined: '[renderBefore] and [renderAfter] config can not be defined on the same component',
        handlerFnNotProvided: 'Handler function was not provided.',
        canNotDestroyComponent: 'You can not destroy a component with attached pre-rendered template.'
    };

    return {
        constructor: function () {
            this.isComponentInstance = true;
        },
        ownerType: 'base',
        replace: false,
        initialized: false,
        animate: false,
        showLoading: false,
        autoLoad: false,
        css: [],
        attrs: [],
        style: '',
        bindViewModel: function () {

            var templateSelectorEmpty;

            if (plz.isEmpty(this.viewModel) || !plz.isFunction(this.applyBindings)) {
                return;
            };

            templateSelectorEmpty = plz.isEmpty(this.templateSelector);
            this.applyBindings();

            if (!templateSelectorEmpty) {
                var tpl = plz.dom.getByAttr(this.templateSelector);
                plz.dom.replaceWith(tpl, this.html);
                tpl = null;
            };

            this.publish('bindings-complete', null, this);
        },
        applyBindings: function () {
            plz.binder.bind(this.html, this.viewModel);
        },
        unapplyBindings: function () {
            plz.binder.unbind(this.viewModel);
        },
        traceUp: function () {
            return plz.isEmpty(this.parentComponent) ? null :
            (!plz.isEmpty(this.parentComponent.$ref) ? this.parentComponent.$ref 
                : plz.getInstanceOf(this.parentComponent.id));
        },
        traceDown: function (value) { // can be type, id or alias if defined on a component
            if (plz.isEmpty(this.components)) {
                return null;
            };

            var children = this.components.filter(function (childComponent) {
                var conditionOk = childComponent.type == value ||
                    childComponent.id == value || childComponent.alias == value;
                return conditionOk;
            }).map(function (childComponent) {
                return plz.getInstanceOf(childComponent.id);
            });

            return children.length == 1 ? children[0] : children;
        },
        load: function () {
            var templateSelectorEmpty = plz.isEmpty(this.templateSelector),
                templateEmpty = plz.isEmpty(this.template),
                urlEmpty = plz.isEmpty(this.ajaxSetup) || plz.isEmpty(this.ajaxSetup.url),
                componentLoaded;

            if (templateEmpty && templateSelectorEmpty && urlEmpty) {
                throw new Error(_const.tplSourceNotDefined);
                return;
            };

            if (urlEmpty) {
                this.render();
                return;
            };

            this.showLoadingMask();
            componentLoaded = plz.proxy(function (result) {
                var res = this.ajaxSetup.dataType == 'text' ? {
                    template: result.data
                } : result.data;

                this.viewModel = !plz.isEmpty(res.viewModel) ? res.viewModel :
                    this.viewModel;
                this.template = !plz.isEmpty(res.template) ? res.template :
                    plz.dom.getByAttr(this.templateSelector).outerHTML;
                this.publish('load-complete', null, this);
                this.render();
            }, this);

            plz.http.get({
                url: this.ajaxSetup.url,
                dataType: this.ajaxSetup.dataType,
                data: this.ajaxSetup.data,
                success: componentLoaded
            });

            componentLoaded = null;
        },
        render: function () {
            var templateSelectorEmpty = plz.isEmpty(this.templateSelector), me = this,
                renderToDefined, container, child, childDomIdx, classes, renderBeforeDefined,
                renderAfterDefined, siblingContainer, insertBeforeOrAfter;
            this.html = !templateSelectorEmpty ? plz.dom.getByAttr(this.templateSelector) :
                plz.dom.clone(plz.dom.parseTemplate(this.template)), me = this;
            this.addAttr({
                name: 'data-componentId',
                value: this.id
            });
            this.addCss(this.css);
            this.addAttr(this.attrs);
            this.addStyle(this.style);

            if (!templateSelectorEmpty) {
                this.init();
                return;
            };

            renderToDefined = !plz.isEmpty(this.renderTo);
            if (!renderToDefined) {
                throw new Error(_const.tplContainerNotDefined);
            };

            container = plz.dom.getEl(this.renderTo);
            if (plz.isEmpty(container)) {
                throw new Error(_const.tplContainerNotFound);
            };

            renderAfterDefined = !plz.isEmpty(this.renderAfter);
            renderBeforeDefined = !plz.isEmpty(this.renderBefore);

            if (renderBeforeDefined && renderAfterDefined) {
                throw new Error(_const.renderBeforeAndAfterDefined);
            };

            insertBeforeOrAfter = function (selector, method) {
                var parent = me.traceUp();
                siblingContainer = plz.dom.getEl(selector, { rootEl: parent.html, all: false });
                plz.dom[method](siblingContainer, me.html);
                me.html = plz.dom.getEl('*[data-componentid="' + me.id + '"]', { // get the dom reference since we will inject html string
                    rootEl: parent.html, all: false
                });
            };

            if (renderBeforeDefined) {
                insertBeforeOrAfter(this.renderBefore, 'insertBefore');
            } else if (renderAfterDefined) {
                insertBeforeOrAfter(this.renderAfter, 'insertAfter');
            } else if (!plz.isEmpty(this.insertAt)) {
                child = this.traceUp().childAt(this.insertAt);
                childDomIdx = plz.isEmpty(child) ? 0 : plz.dom.indexOf(child.html);
                plz.dom.insertAt(container, this.html, childDomIdx);
            } else {
                plz.dom[this.replace ? 'replaceWith' : 'append'](container, this.html);
            };

            this.publish('render-complete', null, this);
            this.init();
        },
        init: function () {

            var me = this, childrenToInitialize;
            this.bindViewModel();

            if (!plz.isEmpty(this.handlers)) {
                plz.forEach(this.handlers, function (handler) {
                    me.handle(handler);
                });
            };

            this.hideLoadingMask();
            this.initialized = true;
            this.publish('init-complete', null, this);

            if (!plz.isEmpty(this.components)) {
                childrenToInitialize = this.components.reduce(function (acc, cmpRef, idx) {
                    var cmp = plz.isEmpty(cmpRef.id) ? null : me.traceDown(cmpRef.id);
                    var needInitialization = plz.isEmpty(cmp) || !cmp.initialized;
                    if (needInitialization) {
                        acc.push({
                            index: idx,
                            component: cmpRef
                        });
                    };
                    return acc;
                }, []);

                plz.forEach(childrenToInitialize, function (item) {
                    item.component.$replace = true;
                    me.addChild(item.component, item.index);
                });

                plz.arr.clear(childrenToInitialize);
                childrenToInitialize = null;
            };

            if(!plz.isEmpty(this.parentComponent) && !plz.isEmpty(this.parentComponent.ref)) {
                this.parentComponent.$ref = null;
                delete this.parentComponent.$ref;
            };
        },
        subscribe: function (triggers) {
            if (plz.isEmpty(triggers) || !plz.isObject(triggers)) {
                return;
            };

            this.triggers = plz.obj.assignTo(this.triggers, triggers);
        },
        publish: function (name, params, component) {
            var me = this;

            var fire = function (component, params) {
                var trg = plz.isEmpty(component.triggers) ? null :
                    component.triggers[name];
                if (!plz.isEmpty(trg)) {
                    trg.call(component, params);
                };
            };

            if (!plz.isEmpty(component)) {
                var isString = plz.isString(component);
                var c = isString ? plz.getInstanceOf(component)
                    : component;
                fire(c, params);
                return;
            };

            plz.application.instances.filter(function (instance) { // events are allowed only on components
                return plz.isComponent(instance);
            }).forEach(function (component) {
                fire(component, params);
            });
        },
        addChild: function (child, index) {

            var hasChildren, parentSelector, instance, childReference, idx, renderTo,
                replace = child.$replace;
            if (plz.isEmpty(child) || plz.isEmpty(child.type)) {
                throw new Error(_const.addChildParamErr);
            };

            delete child.$replace;
            parentSelector = '*[data-componentid="' + this.id + '"]';

            child.autoLoad = false; // prevent auto load since we might be missing [renderTo] from config
            instance = plz.create(child);
            renderTo = child.renderTo || instance.renderTo;

            instance.renderTo = plz.isEmpty(renderTo) ?
                parentSelector.concat(!plz.isEmpty(this.containerElement) ? ' ' + this.containerElement : '') :
                (renderTo == 'root' ? parentSelector : parentSelector.concat(' ').concat(renderTo));

            instance.parentComponent = {
                type: this.type,
                id: this.id
            };

            if(!plz.isEmpty(instance.renderAfter) || !plz.isEmpty(instance.renderBefore)) {
                instance.parentComponent.$ref = this;
            };

            if (!plz.isEmpty(index) && !replace) {
                instance.insertAt = index;
            };

            if (!instance.autoLoad) {
                instance.load();
            };

            hasChildren = !plz.isEmpty(this.components);
            if (!hasChildren) {
                this.components = [];
            };

            childReference = {
                type: instance.type,
                id: instance.id
            };

            if (!plz.isEmpty(instance.alias)) {
                childReference.alias = instance.alias;
            };

            if (!plz.isEmpty(index)) {
                this.components.splice(index, (replace ? 1 : 0), childReference);
            } else {
                this.components.push(childReference);
            };

            childReference = null;
            return instance;
        },
        handle: function (handler) {
            var me = this;
            var fn = plz.isFunction(handler.fn) ? handler.fn : me[handler.fn];
            if (plz.isEmpty(fn)) {
                throw new Error(_const.handlerFnNotProvided);
            };
            var args = [handler.on, me.html, handler.selector, plz.proxy(fn, handler.scope || me)];
            plz.dom.on.apply(plz.dom, args);
        },
        showLoadingMask: function () {
            var renderToDefined = !plz.isEmpty(this.renderTo), container;
            if (!this.showLoading) {
                return;
            };

            var container = this.html;
            if (plz.isEmpty(container)) {
                container = renderToDefined ? plz.dom.getEl(this.renderTo) : plz.dom.getByAttr(this.templateSelector);
            };

            if (!plz.isEmpty(container)) {
                plz.dom.append(container, _const.loadingMaskMarkup);
            };
            container = null;
        },
        hideLoadingMask: function () {
            var renderToDefined = !plz.isEmpty(this.renderTo), container;
            if (!this.showLoading) {
                return;
            };

            container = this.html;
            if (plz.isEmpty(container)) {
                container = renderToDefined ? plz.dom.getEl(this.renderTo) : plz.dom.getByAttr(this.templateSelector);
            };

            if (!plz.isEmpty(container)) {
                var mask = plz.dom.findElement(container, 'div.loading-mask');
                if (!plz.isEmpty(mask)) {
                    plz.dom.remove(mask);
                    mask = null;
                };
            };

            container = null;
        },
        lastChild: function () {

            if (plz.isEmpty(this.components)) {
                return null;
            };

            return this.childAt(this.components.length - 1);
        },
        firstChild: function () {
            return this.childAt(0);
        },
        childAt: function (index) {

            if (plz.isEmpty(this.components) || plz.isEmpty(index)) {
                return null;
            };

            var childRef = this.components[index];

            if (plz.isEmpty(childRef)) {
                return null;
            };

            var childComponent = plz.getInstanceOf(childRef.id);
            return childComponent || null;
        },
        removeChild: function (component, destroy) {

            var doDestroy, compIndex;
            if (plz.isEmpty(component)) {
                return;
            };

            doDestroy = plz.isEmpty(destroy) ? true : destroy;
            compIndex = this.childIndex(component);

            if (doDestroy) {
                component.destroy();
            };

            if (compIndex != -1) {
                this.components.splice(compIndex, 1);
            };

            component = null;
        },
        childCount: function () {
            return plz.isEmpty(this.components) ? 0 : this.components.length;
        },
        childIndex: function (component) {
            var resultIdx = -1;
            if (plz.isEmpty(component)) {
                return resultIdx;
            };

            plz.arr.find(function (child, idx) {
                if (child.id == component.id) {
                    resultIdx = idx;
                };

                return child.id == component.id;
            }, this.components);

            return resultIdx;
        },
        destroy: function () {
            var me, parent;

            if (!plz.isEmpty(this.templateSelector)) {
                throw new Error(_const.canNotDestroyComponent);
            };

            me = this;

            this.publish('before-destroy', null, this);
            this.destroyChildren();
            plz.dom.off(this.html);
            if (!plz.isEmpty(this.viewModel)) {
                this.unapplyBindings();
            };
            plz.dom.remove(this.html);
            this.html = null;
            this.triggers = null;
            this.viewModel = null;
            plz.arr.clear(this.components);
            plz.arr.clear(this.handlers);
            plz.arr.clear(this.mixins);
            parent = this.traceUp();
            if (!plz.isEmpty(parent)) {
                parent.removeChild(this, false);
            };
            this.destroyed = true;
            this.base(arguments);
            this.publish('destroy-complete', null, this);
        },
        destroyChildren: function () {
            var child, instance;
            while (!plz.isEmpty(this.components) &&
                ((child = this.components[0]) != null) && !plz.isEmpty(child.id)) {

                instance = plz.getInstanceOf(child.id);
                instance.destroy();
                instance = null;
            };
        },
        addCss: function (value, el) {

            var isArray, hasClasses, html, cls;
            if (plz.isEmpty(value)) {
                return;
            };

            html = plz.isEmpty(el) ? this.html : (plz.isString(el) ?
                plz.dom.findElement(this.html, el) : el);

            if (plz.isEmpty(html)) {
                return;
            };

            isArray = plz.isArray(value);
            hasClasses = !plz.isEmpty(html.className);

            cls = isArray ? value.join(' ') : value;
            html.className += (hasClasses ? (' ' + cls) : cls);
        },
        addStyle: function (value, el) {
            var isArray, hasStyle, html, style;
            if (plz.isEmpty(value)) {
                return;
            };

            html = plz.isEmpty(el) ? this.html : (plz.isString(el) ?
                plz.dom.findElement(this.html, el) : el);

            if (plz.isEmpty(html)) {
                return;
            };

            isArray = plz.isArray(value);
            hasStyle = !plz.isEmpty(html.style.cssText);

            style = isArray ? value.join(' ') : value;
            html.style.cssText += (hasStyle ? (' ' + style) : style);
        },
        addAttr: function (value, el) {
            var html, isArray, val;
            if (plz.isEmpty(value)) {
                return;
            };

            html = plz.isEmpty(el) ? this.html : (plz.isString(el) ?
                plz.dom.findElement(this.html, el) : el);

            if (plz.isEmpty(html)) {
                return;
            };

            isArray = plz.isArray(value);
            val = isArray ? value : [value];

            plz.forEach(val, function (attr) {
                html.setAttribute(attr.name, attr.value);
            });

            val = null;
        },
        clearHtml: function () {
            plz.forEach(this.html.childNodes, function (child) {
                plz.dom.remove(child);
            }, this);
        }
    };
});
