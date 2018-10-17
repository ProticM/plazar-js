plz.define('ui-bootstrap-card', function () {
    'use strict';

    var _parseTemplate = function () {

        var hasImage = !plz.isEmpty(this.image), image, pos, method;
        var bodyClasses = 'card-body '.concat(this.body ? (!plz.isEmpty(this.body.css) ? this.body.css : []).join(' ') : '').trim();
        var headerClasses = 'card-header '.concat(this.header ? (!plz.isEmpty(this.header.css) ? this.header.css : []).join(' ') : '').trim();
        var footerClasses = 'card-footer '.concat(this.footer ? (!plz.isEmpty(this.footer.css) ? this.footer.css : []).join(' ') : '').trim();

        plz.dom.append(this.html, (this.header ? ('<div class="' + headerClasses + '">' + (plz.isEmpty(this.header.text) ? '' : this.header.text) + '</div>') : ''));
        plz.dom.append(this.html, (this.body ? '<div class="' + bodyClasses + '"></div>' : ''));

        if (this.block) {
            this.html.className = this.html.className.replace('card', 'card-block');
        };

        var bodyEl = plz.dom.findElement(this.html, 'div.card-body');

        if (hasImage) {
            pos = this.image.position || 'top';
            method = pos == 'top' ? 'prepend' : 'append';
            plz.dom[method](this.html, '<img class="card-img"' + (plz.arr.contains(['top', 'bottom'], pos) ? ('-' + pos) : '') + ' src="' + this.image.src + '" alt="card-img_' + this.id + '">');

            if (pos == 'overlay') {
                bodyEl.className = bodyEl.className.replace('card-body', 'card-img-overlay').trim();
            };
        };

        plz.dom.append(bodyEl, (plz.isEmpty(this.body.title) ? '' : '<h5 class="card-title">' + this.body.title + '</h5>'));
        plz.dom.append(bodyEl, (plz.isEmpty(this.body.text) ? '' : '<div class="card-text">' + this.body.text + '</div>'));

        plz.dom.append(this.html, (this.footer ? ('<div class="' + footerClasses + '">' + (plz.isEmpty(this.footer.text) ? '' : this.footer.text) + '</div>') : ''));
    };

    var _createButtons = function (me) {

        if (plz.isEmpty(me.buttons)) {
            return;
        };

        me.footer = true;
        me.footerCss = plz.arr.merge(me.footerCss || [], ['text-right']);

        var buttons = plz.arr.map(function (button) {
            return plz.obj.assignTo(button, {
                type: button.type || 'ui-bootstrap-button',
                renderTo: button.renderTo || ' > div.card-footer'
            }, false);
        }, me.buttons);

        me.components = plz.arr.merge(me.components || [], buttons);
        plz.arr.clear(me.buttons); // clear and delete buttons array since we don't need it anymore
        delete me.buttons;
    };

    return {
        ownerType: 'ui-component',
        template: '<div class="card"></div>',
        block: false,
        containerElement: '> div.card-body',
        header: {
            text: ''
        },
        body: {
            title: '',
            text: ''
        },
        footer: {
            text: ''
        },
        load: function () {
            _createButtons(this);
            this.base(arguments);
        },
        buttons:[],
        parseTemplate: _parseTemplate,
        setHeaderText: function (value) {

            var header;
            if (plz.isEmpty(value)) {
                return;
            };

            header = plz.dom.findElement(this.html, 'div.card-header');
            if (plz.isEmpty(header)) {
                return;
            };

            header.innerHTML = value;
        }
    };
});
