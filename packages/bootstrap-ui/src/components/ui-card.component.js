const card = () => {
    
    let _parseTemplate = function() {

        let hasImage = !pz.isEmpty(this.image), pos, method;
        let bodyClasses = 'card-body '.concat(this.body ? (!pz.isEmpty(this.body.css) ? this.body.css : []).join(' ') : '').trim();
        let headerClasses = 'card-header '.concat(this.header ? (!pz.isEmpty(this.header.css) ? this.header.css : []).join(' ') : '').trim();
        let footerClasses = 'card-footer '.concat(this.footer ? (!pz.isEmpty(this.footer.css) ? this.footer.css : []).join(' ') : '').trim();

        pz.dom.append(this.html, (this.header ? ('<div class="' + headerClasses + '">' + (pz.isEmpty(this.header.text) ? '' : this.header.text) + '</div>') : ''));
        pz.dom.append(this.html, (this.body ? '<div class="' + bodyClasses + '"></div>' : ''));

        if (this.block) {
            this.html.className = this.html.className.replace('card', 'card-block');
        };

        let bodyEl = pz.dom.findElement(this.html, 'div.card-body');

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

    let _createButtons = (me) => {

        if (pz.isEmpty(me.buttons)) {
            return;
        };

        me.footer = true;
        me.footerCss = pz.arr.merge(me.footerCss || [], ['text-right']);

        let buttons = pz.arr.map((button) => {
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
        type: 'ui-bootstrap-card',
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
        load: function() {
            _createButtons(this);
            this.base(arguments);
        },
        buttons:[],
        parseTemplate: _parseTemplate,
        setHeaderText: function(value) {

            let header;
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
};

export default card;