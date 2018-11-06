plz.defineStatic('dom', function () {
    'use strict';

    var _tagNameReg = /<([^\s>]+)(\s|>)+/;

    var _wrapMap = {
        option: [1, "<select multiple='multiple'>", "</select>"],
        thead: [1, "<table>", "</table>"],
        col: [2, "<table><colgroup>", "</colgroup></table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"]
    };
    _wrapMap.optgroup = _wrapMap.option;
    _wrapMap.tbody = _wrapMap.tfoot = _wrapMap.colgroup = _wrapMap.caption = _wrapMap.thead;
    _wrapMap.th = _wrapMap.td;

    var _doInsert = function (element, newNode, where) {

        if (plz.isEmpty(element) || plz.isEmpty(newNode)) {
            return;
        };

        element.insertAdjacentHTML(where, (plz.isString(newNode) ?
            newNode : newNode.outerHTML));
    };

    var _getListener = function (me, element, event) {
        return plz.find(function (lst) {
            return lst.el == element && (!plz.isEmpty(event) ? (lst.event == event) : true);
        }, me.listeners);
    };

    var _delegate = {
        data: [],
        fn: function (e) {

            var target = null;
            var match = false, i = 0, parentEmpty = true,
                triggerEvent, targetMatches, dataItem, selector, fn,
                data = _delegate.data.filter(function (item) {
                    return item.type == e.type;
                });

            while (!plz.isEmpty(dataItem = data[i])
                && !(match = plz.dom.elementMatches(e.target, dataItem.selector))) {
                i++;
            };

            selector = (match ? dataItem.selector : undefined);
            fn = (match ? dataItem.fn : undefined);
            dataItem = null;
            targetMatches = match; //|| e.target == this;

            if (targetMatches) {
                target = e.target;
            };

            if (!targetMatches) {
                var parent = plz.dom.findParent(e.target, selector);
                parentEmpty = plz.isEmpty(parent);
                if (!parentEmpty) {
                    target = parent;
                };
            };

            triggerEvent = targetMatches || !parentEmpty;

            if (triggerEvent && plz.isEmpty(target)) {
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
            if (plz.isEmpty(node) || plz.isEmpty(newNode)) {
                return;
            };

            node.parentNode.replaceChild(newNode, node);
            node = null;
        },

        append: function (parent, element) {
            if (plz.isEmpty(parent) || plz.isEmpty(element)) {
                return;
            };

            if (plz.isString(element)) {
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

            if (plz.isEmpty(selector)) {
                return null;
            };

            return this.getEl(selector, { rootEl: rootEl, all: (all || false) });
        },

        elementMatches: function (element, selector) {
            var fn = Element.prototype.matches || Element.prototype.msMatchesSelector || function (s) {
                var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                    i = matches.length;
                while (--i >= 0 && matches.item(i) !== this) { };
                return i > -1;
            };
            return fn.call(element, selector);
        },

        findParent: function (el, selector, stopSelector) {
            var retval = null, me = this;
            while (!plz.isEmpty(el)) {
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
            // TODO: See if we can use only one collection (_delegate.data/this.listeners)
            var rootEl, lst;

            if (plz.isEmpty(fn)) {
                return;
            };

            rootEl = !plz.isEmpty(element) ? element : document;
            lst = _getListener(this, rootEl, event);
            _delegate.data.push({
                selector: selector,
                fn: fn,
                type: event
            });

            if (!plz.isEmpty(lst)) {
                return;
            };

            rootEl.addEventListener(event, _delegate.fn);
            this.listeners.push({
                el: rootEl,
                event: event
            });

        },

        getByAttr: function (attrValue, attrName) {
            var name = attrName || 'data-template';
            var selector = '*['.concat(name).concat('="').concat(attrValue).concat('"]');
            return document.querySelector(selector);
        },

        getEl: function (selector, options) {
            var getAll = options && options.all || false;
            var root = options && options.rootEl || document;
            var method = getAll ? 'querySelectorAll' : 'querySelector';
            var element = root[method](selector);
            return plz.isEmpty(element) ? null :
                ((element.length == 1 && element.nodeName != 'FORM') ? element[0] : element);
        },

        parseTemplate: function (template) {
            var tagName, temp, trimmed, i,
                regResult, wrapper, wrapperEmpty,
                fragment, result;

            if (!plz.isString(template)) {
                return null;
            };

            trimmed = template.trim();
            regResult = _tagNameReg.exec(trimmed);
            if (plz.isEmpty(regResult)) {
                return null;
            };

            fragment = document.createDocumentFragment();
            tagName = regResult[1];
            wrapper = _wrapMap[tagName];
            wrapperEmpty = plz.isEmpty(wrapper);

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
            var el;
            try {
                el = document.createElement(tagName);
            } catch (e) {
                throw e;
            };
            return el;
        },

        remove: function (element) {
            var parent;

            if (plz.isEmpty(element)) {
                return;
            };

            parent = element.parentNode;
            if(parent) {
                parent.removeChild(element);
            };
            element = null;
        },

        insertAt: function (parent, newNode, index) {
            var referenceNode;
            if (plz.isEmpty(parent) || plz.isEmpty(index)) {
                return;
            };

            if (plz.isEmpty(parent.childNodes)) {
                this.prepend(parent, newNode);
                return;
            };

            referenceNode = parent.childNodes[index];

            if (plz.isEmpty(referenceNode)) {
                throw new Error('Node at index: ' + index + ' was not found.');
            };

            parent.insertBefore(newNode, referenceNode);
        },

        off: function (element, event) {

            var index, listener = plz.find(function (lst, idx) {
                var found = lst.el == element && (!plz.isEmpty(event) ? (lst.event == event) : true);
                if (found) {
                    index = idx;
                };
                return found;
            }, this.listeners);

            if (!plz.isEmpty(listener)) {
                listener.el.removeEventListener(listener.event, _delegate.fn);
            };

            this.listeners.splice(index, 1);
        },

        listeners: [],

        indexOf: function (child) {
            var i = 0;
            while ((child = child.previousSibling) != null)
                i++;
            return i;
        }
    }

}, 'plz');
