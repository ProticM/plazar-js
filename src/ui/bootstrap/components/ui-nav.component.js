plz.define('ui-bootstrap-nav', function () {
    'use strict';

    var _const = {
        componentsNotAllowedInTabMode: 'Components in menu are not allowed while using tab mode',
        hrefIsRequired: 'Each menu item must have [href] property configured'
    };

    var _allowedComponents = [
        'ui-bootstrap-dropdown'
    ];

    var _parseTemplate = function () {
        var hasMenuItems = !plz.isEmpty(this.menuItems),
            hasPosition = !plz.isEmpty(this.position),
            hasMode = !plz.isEmpty(this.mode),
            html = this.mode == 'tab' ? plz.dom.findElement(this.html, 'div.nav.nav-tabs') : this.html,
            parent, tabContent;

        this.addCss(hasPosition ? ('justify-content-' + this.position) : '', html);
        this.addCss(this.vertical ? 'flex-column' : '', html);
        this.addCss(plz.isObject(this.fill) ? ('nav-' + this.fill.type) : (this.fill ? 'nav-fill' : ''), html);

        if (this.pills) {
            html.className = html.className.replace('nav-tabs', 'nav-pills');
        };

        if (this.mode == 'tab') {
            plz.dom.insertAfter(html, '<div class="tab-content"></div>');
            tabContent = html.nextSibling;
        };

        plz.forEach(this.menuItems, function (menuItem, idx) {
            var cls, link, href, contentCls,
                isComponent = plz.arr.contains(_allowedComponents, menuItem.type);

            if (isComponent && this.mode == 'tab') {
                throw new Error(_const.componentsNotAllowedInTabMode);
            };

            if (plz.arr.contains(_allowedComponents, menuItem.type)) {
                menuItem.renderTo = 'root';
                this.components.push(menuItem);
            } else {

                if (plz.isEmpty(menuItem.href)) {
                    throw new Error(_const.hrefIsRequired);
                };

                cls = this.fill ? 'nav-item nav-link' : 'nav-link',
                    link = plz.dom.createElement('a');

                cls += menuItem.css ? (' ' + menuItem.css.join(' ')) : '';
                cls += menuItem.active ? ' active' : '';
                this.addCss(cls, link);
                link.innerText = menuItem.text;
                link.setAttribute('href', (menuItem.href || '#'));

                if (this.mode == 'tab') {
                    link.setAttribute('data-toggle', (this.pills ? 'pill' : 'tab'));
                    link.setAttribute('role', 'tab');
                    href = (menuItem.href.replace('#', ''));
                    contentCls = idx == 0 ? ('tab-pane active tab-' + href) : ('tab-pane tab-' + href);
                    plz.dom.append(tabContent, '<div class="' + contentCls + '" id="' + href + '" role="tabpanel">' + menuItem.text + 'content' + '</div>');
                };

                plz.dom.append(html, link);
            };

        }, this);
    };

    return {
        ownerType: 'ui-component',
        position: 'left',
        template: '<nav class="nav"></nav>',
        components: [],
        load: function () {
            this.template = (this.mode == 'tab') ? '<nav><div class="nav nav-tabs" role="tablist"></div></nav>' :
                '<nav class="nav"></nav>';
            this.base(arguments);
        },
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
        menuItems: [],
        vertical: false,
        fill: false,
        pills: false,
        parseTemplate: _parseTemplate,
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
        },
        destroy: function () {
            if (this.mode == 'tab') {
                $(this.html).tab('dispose');
            };
            this.base(arguments);
        }
    };
});
