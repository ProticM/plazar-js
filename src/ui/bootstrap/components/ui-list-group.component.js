plz.define('ui-bootstrap-list-group', function () {
    'use strict';

    var _const = {
        elementAtIdxNotFound: 'Element at index {0} was not found'
    };

    var _parseTemplate = function () {
        var tabContent;
        this.addCss((this.flushed ? 'list-group-flush' : ''));

        if (this.mode == 'tab') {
            plz.dom.insertAfter(this.html, '<div class="tab-content"></div>');
            tabContent = this.html.nextSibling;
        };

        plz.forEach(this.menuItems, function (menuItem, idx) {
            var actionable, link, contentCls, href, jsVoid = 'javascript:void(0)';

            if (this.noHash && this.mode != 'tab' && plz.isEmpty(menuItem.href)) {
                menuItem.href = !plz.isEmpty(this.href) ? this.href.replace('#', jsVoid) : jsVoid;
            };

            if (plz.isEmpty(menuItem.href)) {
                throw new Error('Each menu item must have [href] property configured');
            };

            actionable = (this.actionable || this.mode == 'tab');
            link = plz.dom.createElement((actionable ? 'a' : 'li'));
            this.addCss((actionable ? 'list-group-item' : 'list-group-item list-group-item-action'), link);

            if (actionable) {
                link.setAttribute('href', (menuItem.href || '#'));
            };

            this.addCss((!plz.isEmpty(menuItem.appearance) ? ('list-group-item-' + menuItem.appearance) : ''), link);
            link.innerText = menuItem.text || '';

            if (!plz.isEmpty(menuItem.css)) {
                this.addCss(menuItem.css, link);
            };

            if (this.mode == 'tab') {
                link.setAttribute('data-toggle', 'list');
                link.setAttribute('role', 'tab');
                href = menuItem.href.replace('#', '');
                contentCls = idx == 0 ? ('tab-pane active tab-' + href) : ('tab-pane tab-' + href);
                plz.dom.append(tabContent, '<div class="' + contentCls + '" id="' + href + '" role="tabpanel">' + menuItem.text + 'content' + '</div>');
            };

            plz.dom.append(this.html, link);
        }, this);
    };

    var _setEnabled = function (me, idx, value) {
        if (plz.isEmpty(idx)) {
            return;
        };

        var el = me.html.childNodes[idx];
        if (plz.isEmpty(el)) {
            var msg = plz.str.format(_const.elementAtIdxNotFound, idx);//_const.elementAtIdxNotFound.replace('{0}', idx);
            throw new Error(msg);
        };

        if (value) {
            el.className = el.className.replace('disabled', '').trim();
        } else {
            me.addCss('disabled', el);
        };
    };

    return {
        ownerType: 'ui-component',
        menuItems: [],
        actionable: false,
        flushed: false,
        mode: 'list',
        init: function () {

            if (this.mode == 'tab') {
                this.handlers = plz.arr.merge((this.handlers || []), [{
                    on: 'show.bs.tab',
                    fn: 'onTabShow'
                }, {
                    on: 'shown.bs.tab',
                    fn: 'onTabShown'
                }, {
                    on: 'hide.bs.tab',
                    fn: 'onTabHide'
                }, {
                    on: 'hidden.bs.tab',
                    fn: 'onTabHidden'
                }]);
            };

            this.base(arguments);
        },
        load: function () {
            this.template = (this.actionable || this.mode == 'tab') ? '<div class="list-group"></div>' :
                '<ul class="list-group"></ul>';
            this.base(arguments);
        },
        template: '<ul class="list-group"></ul>',
        parseTemplate: _parseTemplate,
        disable: function (idx) {
            _setEnabled(this, idx, false);
        },
        enable: function (idx) {
            _setEnabled(this, idx, true);
        },
        onTabShown: function (e) {
            this.publish('shown-bs-tab', e);
        },
        onTabShow: function (e) {
            this.publish('show-bs-tab', e);
        },
        onTabHide: function (e) {
            this.publish('hide-bs-tab', e);
        },
        onTabHidden: function (e) {
            this.publish('hidden-bs-tab', e);
        }
    };
});
