import pz from '../core/plazar-core';

const dom = () => {

    let _tagNameReg = /<([^\s>]+)(\s|>)+/;

    let _wrapMap = {
        option: [1, "<select multiple='multiple'>", "</select>"],
        thead: [1, "<table>", "</table>"],
        col: [2, "<table><colgroup>", "</colgroup></table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"]
    };
    _wrapMap.optgroup = _wrapMap.option;
    _wrapMap.tbody = _wrapMap.tfoot = _wrapMap.colgroup = _wrapMap.caption = _wrapMap.thead;
    _wrapMap.th = _wrapMap.td;

    let _doInsert = function (element, newNode, where) {

        if (pz.isEmpty(element) || pz.isEmpty(newNode)) {
            return;
        };

        element.insertAdjacentHTML(where, (pz.isString(newNode) ?
            newNode : newNode.outerHTML));
    };

    let _getListener = function (element, event) {
        return pz.find(function (lst) {
            return lst.el == element && (!pz.isEmpty(event) ? (lst.event == event) : true);
        }, _delegate.listeners);
    };

    let _delegate = {
        data: [],
        listeners: [],
        remove: function(element, event) {
            let i, j, listenerIndexes = this.listeners.reduce(function (acc, lst, idx) {
                let isOk = (lst.el == element && (!pz.isEmpty(event) ? (lst.event == event) : true));
                if(isOk) { acc.push(idx); };
                return acc;
            }, []), dataIndexes, listenerIdx, listener;

            i = listenerIndexes.length - 1;
            for(; i >= 0; i--) {
                listenerIdx = listenerIndexes[i];
                listener = this.listeners[listenerIdx];
                listener.el.removeEventListener(listener.event, _delegate.fn, listener.capture);
                this.listeners.splice(listenerIdx, 1);

                dataIndexes = this.data.reduce(function(acc, dataItem, idx) {
                    if(dataItem.id == listener.id) { acc.push(idx) };
                    return acc;
                }, []);
                j = dataIndexes.length - 1;
                for(; j >= 0; j--) {
                    let idx = dataIndexes[j];
                    this.data.splice(idx, 1);
                };
            };
            listener = null;
        },
        fn: function (e) {

            let target = null;
            let match = false, i = 0, parentEmpty = true,
                triggerEvent, targetMatches, dataItem, selector, fn,
                data = _delegate.data.filter(function (item) {
                    return item.type == e.type;
                });

            while (!pz.isEmpty(dataItem = data[i])
                && !(match = pz.dom.elementMatches(e.target, dataItem.selector))) {
                i++;
            };

            selector = (match ? dataItem.selector : undefined);
            fn = (match ? dataItem.fn : undefined);
            dataItem = null;
            targetMatches = match;

            if (targetMatches) {
                target = e.target;
            };

            if (!targetMatches) {
                let parent = pz.dom.findParent(e.target, selector);
                parentEmpty = pz.isEmpty(parent);
                if (!parentEmpty) {
                    target = parent;
                };
            };

            triggerEvent = targetMatches || !parentEmpty;

            if (triggerEvent && pz.isEmpty(target)) {
                target = this;
            };

            if (triggerEvent) {
                fn.call(this, target, e);
            };
        }
    };

    return {
        clone: function (el) {
            return el.cloneNode(true);
        },

        replaceWith: function (node, newNode) {
            if (pz.isEmpty(node) || pz.isEmpty(newNode)) {
                return;
            };

            node.parentNode.replaceChild(newNode, node);
            node = null;
        },

        append: function (parent, element) {
            if (pz.isEmpty(parent) || pz.isEmpty(element)) {
                return;
            };

            if (pz.isString(element)) {
                element = this.parseTemplate(element);
            };

            parent.appendChild(element);
        },

        prepend: function (parent, element) {
            _doInsert(parent, element, 'afterbegin');
        },

        insertBefore: function (element, newNode) {
            _doInsert(element, newNode, 'beforebegin');
        },

        insertAfter: function (element, newNode) {
            _doInsert(element, newNode, 'afterend');
        },

        findElement: function (rootEl, selector, all) {

            if (pz.isEmpty(selector)) {
                return null;
            };

            return this.getEl(selector, { rootEl: rootEl, all: (all || false) });
        },

        elementMatches: function (element, selector) {
            let fn = Element.prototype.matches || Element.prototype.msMatchesSelector || function (s) {
                let matches = (this.document || this.ownerDocument).querySelectorAll(s),
                    i = matches.length;
                while (--i >= 0 && matches.item(i) !== this) { };
                return i > -1;
            };
            return fn.call(element, selector);
        },

        findParent: function (el, selector, stopSelector) {
            let retval = null;
            while (!pz.isEmpty(el)) {
                if (this.elementMatches(el, selector)) {
                    retval = el;
                    break;
                } else if (stopSelector && this.elementMatches(el, stopSelector)) {
                    break;
                };
                el = el.parentElement;
            };
            return retval;
        },

        on: function (event, element, selector, fn) {
            let rootEl, lst, lstEmpty, id, capture;

            if (pz.isEmpty(fn)) {
                return;
            };

            rootEl = !pz.isEmpty(element) ? element : document;
            lst = _getListener(rootEl, event);
            lstEmpty = pz.isEmpty(lst);
            id = (lstEmpty ? (Date.now() + Math.random()).toString() : lst.id);

            _delegate.data.push({
                selector: selector,
                fn: fn,
                type: event,
                id: id
            });

            if (!pz.isEmpty(lst)) {
                return;
            };

            capture = ['blur', 'focus', 'focusout', 'focusin'].indexOf(event) != -1;
            rootEl.addEventListener(event, _delegate.fn, capture);
            _delegate.listeners.push({
                el: rootEl,
                event: event,
                id: id,
                capture: capture
            });
        },

        getByAttr: function (attrValue, attrName) {
            let name = attrName || 'data-template';
            let selector = '*['.concat(name).concat('="').concat(attrValue).concat('"]');
            return document.querySelector(selector);
        },

        getEl: function (selector, options) {
            let getAll = options && options.all || false;
            let root = options && options.rootEl || document;
            let method = getAll ? 'querySelectorAll' : 'querySelector';
            let element = root[method](selector);
            return pz.isEmpty(element) ? null :
                ((element.length == 1 && element.nodeName != 'FORM') ? element[0] : element);
        },

        parseTemplate: function (template) {
            let tagName, temp, trimmed, i,
                regResult, wrapper, wrapperEmpty,
                fragment, result;

            if (!pz.isString(template)) {
                return null;
            };

            trimmed = template.trim();
            regResult = _tagNameReg.exec(trimmed);
            if (pz.isEmpty(regResult)) {
                return null;
            };

            fragment = document.createDocumentFragment();
            tagName = regResult[1];
            wrapper = _wrapMap[tagName];
            wrapperEmpty = pz.isEmpty(wrapper);

            temp = fragment.appendChild(this.createElement('div'));
            temp.innerHTML = wrapperEmpty ? trimmed : wrapper[1].concat(trimmed).concat(wrapper[2]);

            i = wrapperEmpty ? 0 : wrapper[0];
            while (i--) {
                temp = temp.lastChild;
            };

            result = temp.childNodes.length == 1 ?
                temp.lastChild : temp.childNodes;

            fragment = null;
            temp = null;
            return result;
        },

        createElement: function (tagName) {
            let el;
            try {
                el = document.createElement(tagName);
            } catch (e) {
                throw e;
            };
            return el;
        },

        remove: function (element) {
            let parent;

            if (pz.isEmpty(element)) {
                return;
            };

            parent = element.parentNode;
            if(!pz.isEmpty(parent)) {
                parent.removeChild(element);
            };
            element = null;
        },

        insertAt: function (parent, newNode, index) {
            let referenceNode;
            if (pz.isEmpty(parent) || pz.isEmpty(index)) {
                return;
            };

            if (pz.isEmpty(parent.childNodes)) {
                this.prepend(parent, newNode);
                return;
            };

            referenceNode = parent.childNodes[index];

            if (pz.isEmpty(referenceNode)) {
                throw new Error('Node at index: ' + index + ' was not found.');
            };

            parent.insertBefore(newNode, referenceNode);
        },

        off: function (element, event) {
            _delegate.remove(element, event);
        },

        indexOf: function (child) {
            let i = 0;
            while ((child = child.previousSibling) != null)
                i++;
            return i;
        }
    }

};

export default dom;