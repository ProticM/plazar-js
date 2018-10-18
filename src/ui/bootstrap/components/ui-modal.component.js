plz.define('ui-bootstrap-modal', function () {
    'use strict';

    var _primaryButtons = ['Yes', 'Ok'];

    var _parseTemplate = function () {
        var headerMarkup = '<div class="modal-header"><h5 class="modal-title">' + (this.header ? (plz.isEmpty(this.header.text) ? '' : this.header.text) : '') +
            '</h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>',
            bodyMarkup = '<div class="modal-body">' + (this.body ? (plz.isEmpty(this.body.text) ? '' : this.body.text) : '') + '</div>',
            footerMarkup = '<div class="modal-footer">' + (this.footer ? (plz.isEmpty(this.footer.text) ? '' : this.footer.text) : '') + '</div>',
            modalContent = plz.dom.findElement(this.html, 'div.modal-content'),
            header = plz.dom.findElement(this.html, 'div.modal-header > h5.modal-title'),
            body = plz.dom.findElement(this.html, 'div.modal-body'),
            footer = plz.dom.findElement(this.html, 'div.modal-footer'),
            modal, hasSize = !plz.isEmpty(this.size);

        var addOrUpdate = function (el, markup, value) {
            if (plz.isEmpty(el)) {
                plz.dom.append(modalContent, markup);
            } else if (plz.isObject(value)) {
                el.innerHTML += value.text;
            };
        };

        addOrUpdate(header, (this.header ? headerMarkup : ''), this.header);
        addOrUpdate(body, (this.body ? bodyMarkup : ''), this.body);
        addOrUpdate(footer, (this.footer ? footerMarkup : ''), this.footer);

        if (this.centered) {
            modal = plz.dom.findElement(this.html, 'div.modal-dialog');
            this.addCss('modal-dialog-centered', modal);
        };

        if (hasSize) {
            modal = plz.dom.findElement(this.html, 'div.modal-dialog');
            this.addCss(('modal-' + this.size), modal);
        };

        this.html.setAttribute('data-keyboard', this.keyboard);
        this.html.setAttribute('data-focus', this.autoFocus);
        this.html.setAttribute('data-backdrop', this.backdrop);
        this.addCss((this.fade ? 'fade' : ''));
    };

    var _hasComponentsForSpecificRender = function (me, cssClass) {
        return plz.arr.contains(me.components, function (item) {
            return (plz.isEmpty(item.renderTo) && me.containerElement == ('div.' + cssClass)) || item.renderTo.indexOf(cssClass);
        });
    };

    return {
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
        init: function () {
            var buttons = this.buttons.split('_'), me = this,
                hasBodyComponents;
            this.components = this.components || [];
            this.footer = !plz.isEmpty(this.buttons) || this.footer;

            plz.forEach(buttons, function (button) {
                this.components.push({
                    type: 'ui-bootstrap-button',
                    appearance: (plz.arr.contains(_primaryButtons, button) || buttons.length == 1) ? 'primary' : 'secondary',
                    renderTo: 'div.modal-footer',
                    text: button,
                    onClick: function (e) {
                        me.buttonHandler.call(this, e, button);
                        if (me.autoHide) {
                            me.hide();
                        };
                    }
                });
            }, this);

            var hasBodyComponents = !plz.isEmpty(this.components) && _hasComponentsForSpecificRender(this, 'modal-body');

            if (hasBodyComponents) {
                this.body = true;
            };

            this.handlers = plz.arr.merge((this.handlers || []), [{
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
        show: function (config) {
            $(this.html).modal('show');
        },
        hide: function () {
            $(this.html).modal('hide');
        },
        update: function () {
            $(this.html).modal('handleUpdate');
        },
        buttonHandler: function () { },
        onModalShown: function (e) {
            this.publish('shown-bs-modal', e);
        },
        onModalShow: function (e) {
            this.publish('show-bs-modal', e);
        },
        onModalHide: function (e) {
            this.publish('hide-bs-modal', e);
        },
        onModalHidden: function (e) {
            this.publish('hidden-bs-modal', e);
            if (this.autoDestroy) {
                $(this.html).modal('dispose');
                this.destroy();
            };
        }
    };
});
