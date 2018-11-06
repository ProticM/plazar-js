pz.define('ui-bootstrap-card', function () {
    'use strict';

    var _parseTemplate = function () {

        var hasImage = !pz.isEmpty(this.image), image, pos, method;
        var bodyClasses = 'card-body '.concat(this.body ? (!pz.isEmpty(this.body.css) ? this.body.css : []).join(' ') : '').trim();
        var headerClasses = 'card-header '.concat(this.header ? (!pz.isEmpty(this.header.css) ? this.header.css : []).join(' ') : '').trim();
        var footerClasses = 'card-footer '.concat(this.footer ? (!pz.isEmpty(this.footer.css) ? this.footer.css : []).join(' ') : '').trim();

        pz.dom.append(this.html, (this.header ? ('<div class="' + headerClasses + '">' + (pz.isEmpty(this.header.text) ? '' : this.header.text) + '</div>') : ''));
        pz.dom.append(this.html, (this.body ? '<div class="' + bodyClasses + '"></div>' : ''));

        if (this.block) {
            this.html.className = this.html.className.replace('card', 'card-block');
        };

        var bodyEl = pz.dom.findElement(this.html, 'div.card-body');

        if (hasImage) {
            pos = this.image.position || 'top';
            method = pos == 'top' ? 'prepend' : 'append';
            pz.dom[method](this.html, '<img class="card-img"' + (pz.arr.contains(['top', 'bottom'], pos) ? ('-' + pos) : '') + ' src="' + this.image.src + '" alt="card-img_' + this.id + '">');

            if (pos == 'overlay') {
                bodyEl.className = bodyEl.className.replace('card-body', 'card-img-overlay').trim();
            };
        };

        pz.dom.append(bodyEl, (pz.isEmpty(this.body.title) ? '' : '<h5 class="card-title">' + this.body.title + '</h5>'));
        pz.dom.append(bodyEl, (pz.isEmpty(this.body.text) ? '' : '<div class="card-text">' + this.body.text + '</div>'));

        pz.dom.append(this.html, (this.footer ? ('<div class="' + footerClasses + '">' + (pz.isEmpty(this.footer.text) ? '' : this.footer.text) + '</div>') : ''));
    };

    var _createButtons = function (me) {

        if (pz.isEmpty(me.buttons)) {
            return;
        };

        me.footer = true;
        me.footerCss = pz.arr.merge(me.footerCss || [], ['text-right']);

        var buttons = pz.arr.map(function (button) {
            return pz.obj.assignTo(button, {
                type: button.type || 'ui-bootstrap-button',
                renderTo: button.renderTo || ' > div.card-footer'
            }, false);
        }, me.buttons);

        me.components = pz.arr.merge(me.components || [], buttons);
        pz.arr.clear(me.buttons); // clear and delete buttons array since we don't need it anymore
        delete me.buttons;
    };

    return {
        ownerType: 'ui-bootstrap-component',
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
            if (pz.isEmpty(value)) {
                return;
            };

            header = pz.dom.findElement(this.html, 'div.card-header');
            if (pz.isEmpty(header)) {
                return;
            };

            header.innerHTML = value;
        }
    };
});
