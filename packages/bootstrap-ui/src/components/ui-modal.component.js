import pz from '@plazarjs/core';
import $ from 'jquery';
import uiBase from '../base/ui-base.component';

const modal = () => {

    let _primaryButtons = ['Yes', 'Ok'];

    let _parseTemplate = function() {
        let headerMarkup = '<div class="modal-header"><h5 class="modal-title">' + (this.header ? (pz.isEmpty(this.header.text) ? '' : this.header.text) : '') +
            '</h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>',
            bodyMarkup = '<div class="modal-body">' + (this.body ? (pz.isEmpty(this.body.text) ? '' : this.body.text) : '') + '</div>',
            footerMarkup = '<div class="modal-footer">' + (this.footer ? (pz.isEmpty(this.footer.text) ? '' : this.footer.text) : '') + '</div>',
            modalContent = pz.dom.findElement(this.html, 'div.modal-content'),
            header = pz.dom.findElement(this.html, 'div.modal-header > h5.modal-title'),
            body = pz.dom.findElement(this.html, 'div.modal-body'),
            footer = pz.dom.findElement(this.html, 'div.modal-footer'),
            modal, hasSize = !pz.isEmpty(this.size);

        let addOrUpdate = (el, markup, value) => {
            if (pz.isEmpty(el)) {
                pz.dom.append(modalContent, markup);
            } else if (pz.isObject(value)) {
                el.innerHTML += value.text;
            };
        };

        addOrUpdate(header, (this.header ? headerMarkup : ''), this.header);
        addOrUpdate(body, (this.body ? bodyMarkup : ''), this.body);
        addOrUpdate(footer, (this.footer ? footerMarkup : ''), this.footer);

        if (this.centered) {
            modal = pz.dom.findElement(this.html, 'div.modal-dialog');
            this.addCss('modal-dialog-centered', modal);
        };

        if (hasSize) {
            modal = pz.dom.findElement(this.html, 'div.modal-dialog');
            this.addCss(('modal-' + this.size), modal);
        };

        this.html.setAttribute('data-keyboard', this.keyboard);
        this.html.setAttribute('data-focus', this.autoFocus);
        this.html.setAttribute('data-backdrop', this.backdrop);
        this.addCss((this.fade ? 'fade' : ''));
    };

    let _hasComponentsForSpecificRender = (me, cssClass) => {
        return pz.arr.contains(me.components, (item) => {
            return (pz.isEmpty(item.renderTo) && me.containerElement == ('div.' + cssClass)) || item.renderTo.indexOf(cssClass);
        });
    };

    return {
        type: 'ui-bootstrap-modal',
        ownerType: 'ui-bootstrap-component',
        containerElement: 'div.modal-body',
        renderTo: 'body',
        autoLoad: true,
        buttons: 'Yes_No_Cancel',
        centered: false,
        autoDestroy: false,
        autoHide: true,
        autoFocus: true,
        keyboard: true,
        backdrop: true, // or 'static'
        template: '<div class="modal" tabindex="-1" role="dialog"><div class="modal-dialog" role="document"><div class="modal-content"></div></div></div>',
        header: {
            text: ''
        },
        body: {
            text: ''
        },
        footer: {
            text: ''
        },
        fade: false,
        init: function() {
            let buttons = this.buttons.split('_'), me = this,
                hasBodyComponents;
            this.components = this.components || [];
            this.footer = !pz.isEmpty(this.buttons) || this.footer;

            pz.forEach(buttons, (button) => {
                this.components.push({
                    type: 'ui-bootstrap-button',
                    appearance: (pz.arr.contains(_primaryButtons, button) || buttons.length == 1) ? 'primary' : 'secondary',
                    renderTo: 'div.modal-footer',
                    text: button,
                    onClick: (e) => {
                        me.onButtonClick.call(this, e, button);
                        if (me.autoHide) {
                            me.hide();
                        };
                    }
                });
            }, this);

            hasBodyComponents = !pz.isEmpty(this.components) && _hasComponentsForSpecificRender(this, 'modal-body');

            if (hasBodyComponents) {
                this.body = true;
            };

            this.handlers = pz.arr.merge((this.handlers || []), [{
                on: 'show.bs.modal',
                fn: 'onModalShow'
            }, {
                on: 'shown.bs.modal',
                fn: 'onModalShown'
            }, {
                on: 'hide.bs.modal',
                fn: 'onModalHide'
            }, {
                on: 'hidden.bs.modal',
                fn: 'onModalHidden'
            }]);

            this.base(arguments);
        },
        parseTemplate: _parseTemplate,
        show: function(config) {
            $(this.html).modal('show');
        },
        hide: function() {
            $(this.html).modal('hide');
        },
        update: function() {
            $(this.html).modal('handleUpdate');
        },
        toggle: function() {
            $(this.html).modal('toggle');
        },
        onButtonClick: function() { },
        onModalShown: function(e) {
            this.publish('shown-bs-modal', e);
        },
        onModalShow: function(e) {
            this.publish('show-bs-modal', e);
        },
        onModalHide: function(e) {
            this.publish('hide-bs-modal', e);
        },
        onModalHidden: function(e) {
            this.publish('hidden-bs-modal', e);
            if (this.autoDestroy) {
                $(this.html).modal('dispose');
                this.destroy();
            };
        }
    };
};

export default uiBase.extend(modal);