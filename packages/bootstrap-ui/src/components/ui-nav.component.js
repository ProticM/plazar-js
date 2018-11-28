import pz from '@plazarjs/core';
import uiBase from '../base/ui-base.component';

const nav = () => {

    let _const = {
        componentsNotAllowedInTabMode: 'Components in menu are not allowed while using tab mode',
        hrefIsRequired: 'Each menu item must have [href] property configured'
    };

    let _allowedComponents = [
        'ui-bootstrap-dropdown'
    ];

    let _parseTemplate = function() {
        let hasPosition = !pz.isEmpty(this.position),
            html = this.mode == 'tab' ? pz.dom.findElement(this.html, 'div.nav.nav-tabs') : this.html,
            tabContent;

        this.addCss(hasPosition ? ('justify-content-' + this.position) : '', html);
        this.addCss(this.vertical ? 'flex-column' : '', html);
        this.addCss(pz.isObject(this.fill) ? ('nav-' + this.fill.type) : (this.fill ? 'nav-fill' : ''), html);

        if (this.pills) {
            html.className = (this.mode == 'tab') ? html.className.replace('nav-tabs', 'nav-pills') : 
                html.className + ' nav-pills';
        };

        if (this.mode == 'tab') {
            pz.dom.insertAfter(html, '<div class="tab-content"></div>');
            tabContent = html.nextSibling;
        };

        pz.forEach(this.menuItems, (menuItem, idx) => {
            let cls, link, href, contentCls,
                isComponent = pz.arr.contains(_allowedComponents, menuItem.type);

            if (isComponent && this.mode == 'tab') {
                throw new Error(_const.componentsNotAllowedInTabMode);
            };

            if (isComponent) {
                menuItem.renderTo = 'root';
                this.components.push(menuItem);
            } else {

                if (pz.isEmpty(menuItem.href)) {
                    throw new Error(_const.hrefIsRequired);
                };

                cls = this.fill ? 'nav-item nav-link' : 'nav-link',
                    link = pz.dom.createElement('a');

                cls += menuItem.css ? (' ' + menuItem.css.join(' ')) : '';
                cls += menuItem.active ? ' active' : '';
                this.addCss(cls, link);
                link.innerText = menuItem.text;

                if (this.mode == 'tab') {
                    link.setAttribute('data-toggle', (this.pills ? 'pill' : 'tab'));
                    link.setAttribute('role', 'tab');
                    href = (menuItem.href.replace('#', ''));
                    contentCls = idx == 0 ? ('tab-pane active tab-' + href) : ('tab-pane tab-' + href);
                    pz.dom.append(tabContent, '<div class="' + contentCls + '" id="' + href + '" role="tabpanel">' + menuItem.text + ' content' + '</div>');
                };

                link.setAttribute('href', (menuItem.href || '#'));
                pz.dom.append(html, link);
            };

        }, this);
    };

    return {
        type:'ui-bootstrap-nav',
        ownerType: 'ui-bootstrap-component',
        position: 'start',
        template: '<nav class="nav"></nav>',
        components: [],
        mode: 'nav',
        load: function() {
            this.template = (this.mode == 'tab') ? '<nav><div class="nav nav-tabs" role="tablist"></div></nav>' :
                '<nav class="nav"></nav>';
            this.base(arguments);
        },
        init: function() {
            if (this.mode == 'tab') {
                this.handlers = pz.arr.merge((this.handlers || []), [{
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
        onTabShown: function(e) {
            this.publish('shown-bs-tab', e);
        },
        onTabShow: function(e) {
            this.publish('show-bs-tab', e);
        },
        onTabHide: function(e) {
            this.publish('hide-bs-tab', e);
        },
        onTabHidden: function(e) {
            this.publish('hidden-bs-tab', e);
        },
        destroy: function() {
            if (this.mode == 'tab') {
                $(this.html).tab('dispose');
            };
            this.base(arguments);
        }
    };
};

export default uiBase.extend(nav);