// PlazarJS Bootstrap UI
pz.define('ui-bootstrap-component', function () {
    'use strict';

    var _const = {
        handlerFnNotProvided: 'Handler function was not provided.'
    };

    var _initPlugin = function (me, type) {
        var plugin = me[type];
        if (pz.isEmpty(plugin) || !pz.isObject(plugin)) {
            return;
        };

        $(me.html)[type](plugin);
    };

    return {
        ownerType: 'component',
        constructor: function () {

            this.subscribe({
                'render-complete': function () {

                    if (pz.isFunction(this.parseTemplate) && !pz.isEmpty(this.template)) {
                        this.parseTemplate();
                    };

                    this.prependLabel();
                    this.initToolTip();
                    this.initPopOver();
                }
            });

            this.base(arguments);
        },

        prependLabel: function (template) {
            if (pz.isEmpty(this.labelText)) {
                return;
            };

            var label = pz.dom.createElement('label');
            label.innerText = this.labelText;
            this.addCss('col-form-label', label);
            pz.dom.insertBefore(this.html, label);
            label = null;
        },

        initToolTip: function () {
            _initPlugin(this, 'tooltip');
        },

        initPopOver: function () {
            _initPlugin(this, 'popover');
        },

        handle: function (handler) { // override handlers binding since we need bootstrap/jquery custom events
            var me = this, $html = $(this.html);
            var fn = pz.isFunction(handler.fn) ? handler.fn : me[handler.fn];

            if (pz.isEmpty(fn)) {
                throw new Error(_const.handlerFnNotProvided);
            };

            var hasSelector = !pz.isEmpty(handler.selector);
            var args = hasSelector ? [handler.on, handler.selector, pz.proxy(fn, handler.scope || me)] :
                [handler.on, pz.proxy(fn, handler.scope || me)];
            $html.on.apply($html, args);
        },

        destroy: function () {
            $(this.html).tooltip('dispose')
                .popover('dispose');
            $(this.html).off();
            this.base(arguments);
        }
    };
});

pz.define('ui-bootstrap-form-field-mix', function () {
    'use strict';

    var _getHtml = function (me) {
        return me.inputType == 'text' ? (pz.dom.findElement(me.html, 'input') || me.html)
            : me.html;
    };

    var _setAttr = function (me, name, value) {
        var html = _getHtml(me);
        html.setAttribute(name, value);
    };

    return {
        ownerType: 'mixin',
        getValue: function () {
            var html = _getHtml(this);
            return html.value;
        },
        setValue: function (value) {
            var html = _getHtml(this);
            html.value = value;
        },
        setRequired: function (value) {
            _setAttr(this, 'required', (value || true));
        },
        setDisabled: function (value) {
            _setAttr(this, 'disabled', (value || true));
        },
        setReadonly: function (value) {
            _setAttr(this, 'readonly', (value || true));
        }
    };
});

pz.define('ui-bootstrap-alert', function () {
    'use strict';

    var _parseTemplate = function () {

        this.addCss('alert-'.concat(this.appearance));

        var renderLink = !pz.isEmpty(this.link), animation;
        var renderHeading = !pz.isEmpty(this.heading);

        if (renderHeading) {
            pz.dom.append(this.html, '<h' + (this.heading.size || 4) + ' class="alert-heading">' +
                this.heading.text + '</h' + (this.heading.size || 4) + '>');
        };

        if (renderLink) {
            this.text = this.text.replace(this.linkPlaceHolder,
                '<a href="' + (this.link.href || '#') + '" class="alert-link">' + this.link.text + '</a>');
        };

        this.html.innerHTML += this.text;

        if (this.dismissible) {
            animation = this.dismissible.animation;
            this.addCss((!animation ? 'alert-dismissible' : 'alert-dismissible fade show'));
            pz.dom.append(this.html, '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>');
        };
    };

    return {
        ownerType: 'ui-bootstrap-component',
        template: '<div class="alert" role="alert"><div>',
        appearance: 'primary',
        text: '',
        dismissible: false,
        linkPlaceHolder: '##',
        parseTemplate: _parseTemplate,
        autoDestroy: true,
        handlers: [{
            on: 'close.bs.alert',
            fn: 'onClose'
        }, {
            on: 'closed.bs.alert',
            fn: 'onClosed'
        }],
        close: function () {
            $(this.html).alert('close');
        },
        destroy: function () {
            $(this.html).alert('dispose');
            this.base(arguments);
        },
        onClose: function (e) {
            this.publish('close-bs-alert', e);
        },
        onClosed: function (e) {
            this.publish('closed-bs-alert', e);
            if(this.autoDestroy) {
                this.destroy();
            }
        }
    };
});

pz.define('ui-bootstrap-breadcrumb', function () {
    'use strict';

    var _createCrumbs = function (me, crumbs) {
        var ul = pz.dom.findElement(me.html, 'ol.breadcrumb');
        pz.forEach(crumbs, function (crumb) {
            var cls = crumb.isActive ? 'breadcrumb-item active' : 'breadcrumb-item';
            var attr = crumb.isActive ? ' aria-current="page"' : '';
            var text = crumb.asLink ? '<a href="' + (crumb.href || '#') + '">' + crumb.text + '</a>' : crumb.text;

            pz.dom.append(ul, '<li class="' + cls + '"' + attr + '>' + text + '</li>');
        });
    };

    var _parseTemplate = function () {
        _createCrumbs(this, this.crumbs);
    };

    return {
        ownerType: 'ui-bootstrap-component',
        template: '<nav aria-label="breadcrumb"><ol class="breadcrumb"></ol></nav>',
        parseTemplate: _parseTemplate,
        crumbs: [],
        addCrumbs: function (crumb) {
            var isArray, method;

            if (pz.isEmpty(crumb)) {
                return;
            };

            isArray = pz.isArray(crumb);
            method = isArray ? 'concat' : 'push';
            this.crumbs = this.crumbs[method](crumb);
            _createCrumbs(this, isArray ? crumb : [crumb]);
        }
    };
});

pz.define('ui-bootstrap-button-group', function () {
    'use strict';

    var _parseTemplate = function () {
        var sizeCls = !pz.isEmpty(this.size) ? 'btn-group-' + this.size : '';
        this.addCss((this.vertical ? 'btn-group-vertical ' + sizeCls : 'btn-group ' + sizeCls));
        this.html.setAttribute('aria-label', 'label_' + this.id);
        this.html.setAttribute('role', this.renderAs);
    };

    return {
        ownerType: 'ui-bootstrap-component',
        buttons: [],
        renderAs: 'group',
        init: function () {

            var buttons = pz.arr.map(function (button) {
                return pz.isEmpty(button.type) ?
                    pz.obj.assignTo(button, { type: 'ui-bootstrap-button' }, false) : button;
            }, this.buttons);

            this.components = pz.arr.merge(this.components || [], buttons);

            pz.arr.clear(this.buttons);
            delete this.buttons;
            this.base(arguments);
        },
        vertical: false,
        template: '<div></div>',
        parseTemplate: _parseTemplate
    };
});

pz.define('ui-bootstrap-button-toolbar', function () {
    'use strict';

    var _parseTemplate = function () {
        this.html.setAttribute('aria-label', 'label_' + this.id);
    };

    return {
        ownerType: 'ui-bootstrap-component',
        groups: [],
        init: function () {

            var groups = pz.arr.map(function (group) {
                return pz.isEmpty(group.type) ?
                    pz.obj.assignTo(group, { type: 'ui-bootstrap-button-group' }, false) : group;
            }, this.groups);

            this.components = pz.arr.merge(this.components || [], groups);

            pz.arr.clear(this.groups);
            delete this.groups;

            this.base(arguments);
        },
        template: '<div class="btn-toolbar" role="toolbar"></div>',
        parseTemplate: _parseTemplate
    };
});

pz.define('ui-bootstrap-button', function () {
    'use strict';

    var _parseTemplate = function () {
        var hasSize = !pz.isEmpty(this.size), hasHref = !pz.isEmpty(this.href);
        this.html.innerHTML = this.text;
        this.addCss(('btn-' + this.appearance + (hasSize ? ' btn-' + this.size : '')));
        this.addCss((!pz.isEmpty(this.align) ? 'float-' + this.align : ''));
        this.html.setAttribute((hasHref ? 'href' : 'type'), (hasHref ? this.href : this.buttonType));
	};

	return {
		ownerType: 'ui-bootstrap-component',
        appearance: 'primary',
        text: 'Button',
        buttonType: 'button',
        template: '<button class="btn"></button>',
        load: function () {
            if (!pz.isEmpty(this.href)) {
                this.template = this.template.replace('<button', '<a').replace('button>', 'a>');
            };
            this.base(arguments)
        },
        init: function () {
            if (pz.isEmpty(this.href)) {
                this.handle({
                    on: 'click',
                    fn: 'onClick'
                });
            };
            this.base(arguments);
        },
        parseTemplate: _parseTemplate,
		onClick: function () { },
        toggle: function () {
            $(this.html).button('toggle');
        },
        destroy: function () {
            $(this.html).button('dispose');
            this.base(arguments);
        },
        setDisabled: function (value) {
            // TODO: link disable
            if (pz.isEmpty(value) || value == true) {
                this.html.setAttribute('disabled', '');
            } else {
                this.html.removeAttribute('disabled');
            };
        },
        setText: function (value) {

            if (pz.isEmpty(value)) {
                return;
            };

            this.html.innerHTML = value;
        }
	};
});

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

pz.define('ui-bootstrap-carousel', function () {
    'use strict';

    var _getNavButton = function (id, type) {
        return '<a class="carousel-control-' + type + '" href="#carousel_' + id + '" role="button" data-slide="' + type +
            '"><span class="carousel-control-' + type + '-icon" aria-hidden="true"></span><span class="sr-only">' + type + '</span></a>';
    };

    var _parseTemplate = function () {

        this.html.setAttribute('id', 'carousel_' + this.id);
        this.html.setAttribute('data-interval', this.interval);
        this.html.setAttribute('data-keyboard', this.keyboard);
        this.html.setAttribute('data-pause', (this.pauseOnHover ? false : 'hover'));

        var indicators, me = this, prevBtn, nextBtn, item, inner, css, mainCss;

        if (this.indicators) {
            pz.dom.append(this.html, '<ol class="carousel-indicators"></ol');
            indicators = pz.dom.findElement(this.html, 'ol.carousel-indicators');
        };

        pz.dom.append(this.html, '<div class="carousel-inner"></div>');
        inner = pz.dom.findElement(this.html, 'div.carousel-inner');

        pz.forEach(this.slides, function (slide, index) {

            if (me.indicators) {
                pz.dom.append(indicators, '<li data-target="#carousel_' + me.id + '" data-slide-to="' + index + '"></li>');
            };

            mainCss = 'carousel-item' + ((index == 0 ? ' active' : '') + ' slide_' + index);
            css = pz.isEmpty(slide.css) ? mainCss : (mainCss + ' ' + slide.css.join(' ')).trim();
            item = pz.dom.parseTemplate('<div class="' + css + '">' + slide.text + '</div>');

            if (!pz.isEmpty(slide.caption)) {
                pz.dom.append(item, '<div class="carousel-caption d-none d-md-block">' + slide.caption + '</div>');
            };

            pz.dom.append(inner, item);
        });

        prevBtn = _getNavButton(this.id, 'prev');
        nextBtn = _getNavButton(this.id, 'next');

        pz.dom.append(this.html, prevBtn);
        pz.dom.append(this.html, nextBtn);

    };

    var _slide = function (me, to) {
        $(me.html).carousel(to);
    };

    return {
        ownerType: 'ui-bootstrap-component',
        template: '<div class="carousel slide" data-ride="carousel"></div>',
        indicators: true,
        interval: 5000,
        keyboard: true,
        pauseOnHover: false,
        handlers: [{
            on: 'slide.bs.carousel',
            fn: 'onSlide'
        }, {
            on: 'slid.bs.carousel',
            fn: 'onSlid'
        }],
        slides: [],
        parseTemplate: _parseTemplate,
        destroy: function () {
            $(this.html).carousel('dispose');
            this.base(arguments);
        },
        onSlide: function (e) {
            this.publish('slide-bs-carousel', e);
        },
        onSlid: function (e) {
            this.publish('slid-bs-carousel', e);
        },
        slideNext: function () {
            _slide(this, 'next');
        },
        slidePrev: function () {
            _slide(this, 'prev');
        },
        slideTo: function (number) {
            _slide(this, number);
        },
        cycle: function (pause) {
            _slide(this, (pause ? 'pause' : 'cycle'));
        }
    };
});

pz.define('ui-bootstrap-collapse', function () {
    'use strict';

    var _setIfNotEmpty = function (me, propName) {
        if (!pz.isEmpty(me[propName])) {
            me.html.setAttribute(('data-' + propName), me[propName]);
        };
    };

    var _setVisibility = function (me, value) {
        $(me.html).collapse(value);
    };

    return {
        ownerType: 'ui-bootstrap-button',
        parseTemplate: function () {
            this.base(arguments);
            this.html.setAttribute('data-toggle', 'collapse');

            _setIfNotEmpty(this, 'target');
            _setIfNotEmpty(this, 'parent');
        },
        target: '',
        parent: '',
        init: function () {
            pz.arr.clear(this.handlers);
            this.base(arguments);
        },
        toggle: function () {
            $(this.html).collapse('toggle');
        },
        destroy: function () {
            $(this.html).collapse('dispose');
            this.base(arguments);
        },
        show: function () {
            _setVisibility(this, 'show');
        },
        hide: function () {
            _setVisibility(this, 'hide');
        }
    };
});

pz.define('ui-bootstrap-container', function () {
    'use strict';

    var _defaultColSize = 12;

    var _getColumnSizeClass = function (size) {
        var _default = 'col-' + _defaultColSize,
            lg, md, sm, css;

        if (pz.isEmpty(size)) {
            return _default;
        };

        lg = !pz.isEmpty(size.lg) ? 'col-lg-' + size.lg : '';
        md = !pz.isEmpty(size.md) ? ' col-md-' + size.md : '';
        sm = !pz.isEmpty(size.sm) ? ' col-sm-' + size.sm : '';

        css = lg + md + sm;
        return !pz.isEmpty(css) ?
            css : _default;
    };

    var _parseJumbotron = function (me, jumbotron) {

        var hasBtn, hasLeadText, hasTitle, hasDivider, mainContainer;
        if (pz.isEmpty(jumbotron)) {
            return;
        };

        hasBtn = !pz.isEmpty(jumbotron.buttons);
        hasLeadText = !pz.isEmpty(jumbotron.leadText);
        hasTitle = !pz.isEmpty(jumbotron.title);
        hasDivider = !pz.isEmpty(jumbotron.divider);
        mainContainer = me.html;
        
        if (me.fluid) {
            pz.dom.append(me.html, '<div class="container' + (jumbotron.innerFluid ? '-fluid' : '') + ' jumbotron-body"></div>');
            mainContainer = pz.dom.findElement(me.html, 'div.jumbotron-body');
        };

        if (hasTitle) {
            var size = jumbotron.title.size || 4;
            var text = jumbotron.title.text || 'Welcome';
            pz.dom.append(mainContainer, '<h1 class="display-' + size + '">' + text + '</h1>');
        };

        if (hasLeadText) {
            pz.dom.append(mainContainer, '<p class="lead">' + jumbotron.leadText + '</p>');
        };

        if (hasBtn) {

            if (hasDivider) {
                pz.dom.append(mainContainer, '<hr class="my-' + (jumbotron.divider.size || 4) + '">');
            };

            pz.dom.append(mainContainer, '<p class="lead jumbotron-button"></p>');
            pz.forEach(jumbotron.buttons, function (button) {
                var btn = {};
                pz.obj.assignTo(btn, button, false);
                btn.renderTo = 'p.lead.jumbotron-button';

                if (pz.isEmpty(btn.type)) {
                    btn.type = 'ui-bootstrap-button';
                };

                me.components.push(btn);
            });
        };
    };

    return {
        ownerType: 'ui-bootstrap-component',
        template: '<div></div>',
        renderAs: 'container', // can be row, form-row, container, column, jumbotron
        fluid: false,
        body: '', // can be html
        components: [],
        parseTemplate: function () {

            var cls = this.renderAs == 'row' ? 'row' :
                (this.renderAs == 'form-row' ? 'form-row' : (this.renderAs == 'column' ? _getColumnSizeClass(this.column) :
                    (this.renderAs == 'jumbotron' ? (this.fluid ? 'jumbotron jumbotron-fluid' : 'jumbotron') :
                        (this.fluid ? 'container-fluid' : 'container'))));

            var hasChildren = !pz.isEmpty(this.components);
            this.addCss(cls);
            this.html.innerHTML = (hasChildren ? '' : (pz.isEmpty(this.body) ? '' : this.body));

            if (this.renderAs == 'jumbotron') {
                _parseJumbotron(this, this.jumbotron);
            };
        }
    };
});

pz.define('ui-bootstrap-dropdown', function () {
    'use strict';

    var _parseTemplate = function () {
        var hasSize = !pz.isEmpty(this.size), btn, hasPosition =
            !pz.isEmpty(this.dropPosition), hasHeader = !pz.isEmpty(this.menuHeaderText),
            hasAppearance = !pz.isEmpty(this.appearance);

        if (this.split) {
            pz.dom.prepend(this.html, '<button type="button" class="btn' + (hasAppearance ? (' btn-' + this.appearance) : '') + '">' + this.text + '</button>');
            this.html.className = this.html.className.replace('dropdown', 'btn-group');
        };

        if (hasPosition) {
            this.html.className = this.html.className.replace('dropdown', 'btn-group');
            this.addCss(('drop' + this.dropPosition));
        };

        var btn = pz.dom.findElement(this.html, (this.inNav ? 'a' : 'button') + '.dropdown-toggle');
        this.addCss(((hasAppearance ? ('btn-' + this.appearance) : '') + (hasSize ? (' btn-' + this.size) : '') + (this.split ? ' dropdown-toggle-split' : '')), btn);
        btn[this.split ? 'innerHTML' : 'innerText'] = (this.split ? '<span class="sr-only">Toggle Dropdown</span>' : this.text);

        var cls = 'dropdown-menu';
        pz.dom.append(this.html, '<div class="' + cls + '"></div>');
        var menuWrapper = pz.dom.findElement(this.html, 'div.dropdown-menu');

        if (hasHeader) {
            pz.dom.append(menuWrapper, '<h6 class="dropdown-header">' + this.menuHeaderText + '</h6>');
        };

        if (!pz.isEmpty(this.components)) {
            return;
        };

        pz.forEach(this.menuItems, function (item) {
            pz.dom.append(menuWrapper, '<a class="dropdown-item" href="' + (item.href || '#') + '">' + item.text + '</a>');
            if (item.divide) {
                pz.dom.append(menuWrapper, '<div class="dropdown-divider"></div>');
            };
        });
    };

    return {
        ownerType: 'ui-bootstrap-component',
        template: '<div class="dropdown"><button class="btn dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button></div>',
        load: function () {
            var parent = this.traceUp();
            var isInNav = !pz.isEmpty(parent) && pz.arr.contains([parent.type, parent.ownerType], 'ui-bootstrap-navbar');
            this.inNav = this.inNav || isInNav;
            if (this.inNav) {
                this.template = '<li class="nav-item dropdown"><a class="nav-link dropdown-toggle" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></a></div>';
                this.appearance = null;
            };
            this.base(arguments);
        },
        containerElement: 'div.dropdown-menu',
        appearance: 'primary',
        text: 'Dropdown',
        split: false,
        menuItems: [],
        parseTemplate: _parseTemplate,
        destroy: function () {
            $(this.html).dropdown('dispose');
            this.base(arguments);
        },
        toggle: function () {
            $(this.html).dropdown('toggle');
        },
        update: function () {
            $(this.html).dropdown('update');
        }
    };
});

pz.define('ui-bootstrap-form', function () {
    'use strict';

    var _parseTemplate = function () {
        var hasAction = !pz.isEmpty(this.action), hasMethod = !pz.isEmpty(this.method);

        if (hasAction) {
            this.setAttribute('action', this.action);
        };

        if (hasMethod) {
            this.setAttribute('method', this.method);
        };

        this.addCss((this.inline ? 'form-inline' : ''));
    };

    return {
        ownerType: 'ui-bootstrap-component',
        template: '<form></form>',
        inline: false,
        components: [],
        button: {
            text: 'Submit',
            appearance: 'primary',
            type: 'submit',
            align: 'right',
            css: []
        },
        init: function () {

            pz.forEach(this.components, function (component) {
                component.inForm = component.type == 'ui-bootstrap-input';
            }, this);

            if (!pz.isEmpty(this.button)) {
                var button = {
                    type: 'ui-bootstrap-button',
                    text: this.button.text || 'Submit',
                    appearance: this.button.appearance || 'primary',
                    buttonType: this.button.type || 'submit',
                    css: this.button.css || [],
                    align: this.button.align || 'right'
                };

                if (pz.isFunction(this.button.onClick)) {
                    button.onClick = this.button.onClick;
                };

                this.components.push(button);
            };

            this.base(arguments);
        },
        parseTemplate: _parseTemplate,
        validate: function () {

        }
    };
});

pz.define('ui-bootstrap-grid', function () {
    'use strict';

    var _defaultColSize = 12;

    var _getColumnSizeClass = function (size) {
        var _default = 'col-' + _defaultColSize,
            lg, md, sm;

        if (pz.isEmpty(size)) {
            return _default;
        };

        lg = !pz.isEmpty(size.lg) ? 'col-lg-' + size.lg : '';
        md = !pz.isEmpty(size.md) ? ' col-md-' + size.md : '';
        sm = !pz.isEmpty(size.sm) ? ' col-sm-' + size.sm : '';

        var css = lg + md + sm;
        return !pz.isEmpty(css) ?
            css : _default;
    };

    var _parseTemplate = function () {
        var me = this;
        this.addCss((this.fluid ? 'container-fluid' : 'container'));

        pz.forEach(this.rows, function (row, idx) {
            var rowEl = pz.dom.createElement('div'), 
                generateRowId = !pz.isEmpty(row.id) || row.generateId;

            if(generateRowId) {
                me.addAttr({
                    name: 'id',
                    value: row.id || ('row-' + idx)
                }, rowEl);
            };
            
            me.addCss('row', rowEl);
            if (!pz.isEmpty(row.css)) {
                me.addCss(row.css.join(' '), rowEl);
            };
            pz.dom.append(me.html, rowEl);

            pz.forEach(row.columns, function (column, idx) {
                var sizeClass = _getColumnSizeClass(column.size),
                    columnEl = pz.dom.createElement('div'),
                    generateColumnId = !pz.isEmpty(column.id) || column.generateId;

                me.addCss(sizeClass, columnEl);
                if (!pz.isEmpty(column.css)) {
                    me.addCss(column.css, columnEl);
                };

                if(generateColumnId) {
                    me.addAttr({
                        name: 'id',
                        value: column.id || ('column-' + idx)
                    }, columnEl);
                };

                columnEl.innerHTML = !pz.isEmpty(column.text) ? 
                    column.text : '';

                pz.dom.append(rowEl, columnEl);
            });
        });
    };

    return {
        ownerType: 'ui-bootstrap-component',
        fluid: false,
        rows: [{
            generateId: false,
            css: [],
            columns: [{
                generateId: false,
                text: '',
                size: _defaultColSize,
                css: []
            }]
        }],
        template: '<div></div>',
        parseTemplate: _parseTemplate
    };
});

pz.define('ui-bootstrap-input-group', function () {
    'use strict';

    var _const = {
        addonEmpty: 'Component of type [ui-bootstrap-input-group] requires at least one addon. See addon config docs.',
        unsupportedInputType: 'Provided input type is not supported. Please use one of the following: \'ui-bootstrap-input\' or \'ui-bootstrap-select\''
    };

    var _allowedComponents = [
        'ui-bootstrap-button',
        'ui-bootstrap-dropdown',
        'ui-bootstrap-input'
    ];

    var _getAddonWrapper = function (me, addon) {
        var wrapper = pz.dom.findElement(me.html, ('div.input-group-' + addon.position));
        return wrapper || (function () {
            pz.dom[addon.position](me.html, '<div class="input-group-' + addon.position + '"></div>');
            return pz.dom.findElement(me.html, ('div.input-group-' + addon.position));
        })();
    };

    var _addTextWrapper = function (wrapper, text, tempCls) {
        pz.dom.append(wrapper, '<div class="input-group-text' + (' ' + tempCls || '') + '">' + (text || '') + '</div>');
    };

    return {
        ownerType: 'ui-bootstrap-component',
        template: '<div class="input-group"></div>',
        parseTemplate: function () {
            var hasSize = !pz.isEmpty(this.size);
            this.addCss((hasSize ? ('input-group-' + this.size) : ''));
        },
        input: {
            type: 'ui-bootstrap-input' // or ui-bootstrap-select
        },
        init: function () {
            var addons, addons, wrapper, component;

            if (pz.isEmpty(this.addon)) {
                throw new Error(_const.addonEmpty);
            };

            if (!pz.arr.contains(['ui-bootstrap-input', 'ui-bootstrap-select'], this.input.type)) {
                throw new Error(_const.unsupportedInputType);
            };

            addons = pz.isArray(this.addon) ? this.addon : [this.addon];
            pz.arr.clear(this.components);
            this.components = [];

            pz.forEach(addons, function (addon, idx) {

                if (pz.isEmpty(addon.position)) {
                    addon.position = 'prepend';
                };

                if (addon.position == 'append') {
                    this.input.renderAfter = 'div.input-group-prepend';
                };

                wrapper = _getAddonWrapper(this, addon), component = {};
                if (pz.arr.contains(_allowedComponents, addon.renderAs.type)) {
                    var renderTo = ('div.input-group-' + addon.position);

                    if (addon.renderAs.type == 'ui-bootstrap-input') {
                        _addTextWrapper(wrapper, null, ('component-addon-' + idx));
                        renderTo = ('div.input-group-text.component-addon-' + idx);
                        component.simple = true;
                    };

                    if (addon.renderAs.type == 'ui-bootstrap-select') {
                        component.custom = true;
                    };

                    pz.obj.assignTo(component, addon.renderAs, false);
                    component.renderTo = renderTo;
                    this.components.push(component);
                } else {
                    _addTextWrapper(wrapper, addon.renderAs.text);
                };
            }, this);

            this.base(arguments);
            this.addChild(this.input);
        }
    };
});

pz.define('ui-bootstrap-input', function () {
    'use strict';

    var _parseTemplate = function () {

        var clone, tpl, label, input, hasSize = !pz.isEmpty(this.size),
            input = pz.dom.findElement(this.html, 'input') || this.html,
            hasGroup = !pz.isEmpty(this.group);

        this.addCss((hasSize ? ('form-control-' + this.size) : ''), input);
        input.setAttribute('id', ('input_' + this.id));

        if (pz.arr.contains(['text'], this.inputType)) {

            if (!this.readonly) {
                input.setAttribute('placeholder', this.placeholder);
            };

            if (this.plaintext) {
                input.className = input.className.replace('form-control', 'form-control-plaintext');
            };

            if (this.readonly) {
                input.setAttribute('readonly', '');
            };

            if (!pz.isEmpty(this.helpText)) {
                input.setAttribute('aria-describedby', ('help_' + this.id));
                pz.dom.insertAfter(input, '<small class="form-text text-muted" id="help_' + this.id + '">' + this.helpText + '</small>');
            };
            
        };

        if (pz.arr.contains(['checkbox', 'radio'], this.inputType)) {

            var isRadio = this.inputType == 'radio';

            if (isRadio && hasGroup) {
                input.setAttribute('name', this.group);
            };

            if (this.simple) {
                input.className = '';
                input.removeAttribute('class');
                return;
            };

            input.className = input.className.replace('form-control', 'form-check-input');
            clone = pz.dom.clone(input);
            tpl = pz.dom.createElement('div');

            this.addCss('form-check', tpl);
            this.addCss((this.inForm ? 'mb-3' : ''), tpl);
            this.addCss((this.inline ? 'form-check-inline' : ''), tpl);
            pz.dom.append(tpl, clone);

            if (!pz.isEmpty(this.labelText)) {
                label = pz.dom.createElement('label');
                label.innerText = this.labelText;
                this.addCss('form-check-label', label);
                label.setAttribute('for', ('input_' + this.id));
                pz.dom.append(tpl, label);
                label = null;
            };

            pz.dom.replaceWith(this.html, tpl);
            this.html = tpl;

            //if (this.inForm) {
            //    pz.dom.remove(input);
            //    pz.dom.append(this.html, tpl);
            //} else {
            //    pz.dom.replaceWith(this.html, tpl);
            //    this.html = tpl;
            //};

            tpl = null;
            clone = null;
        };
    };

    return {
        ownerType: 'ui-bootstrap-component',
        mixins: ['ui-bootstrap-form-field-mix'],
        inputType: 'text',
        inForm: false,
        readonly: false,
        placeholder: 'Enter text...',
        plaintext: false,
        inline: false,
        load: function () {
            var css = this.inputType == 'file' ? 'form-control-file' : 'form-control';
            var input = '<input class="' + css + '" type="' + this.inputType + '"/>';
            this.template = ((this.inForm && !pz.arr.contains(['checkbox', 'radio'], this.inputType)) ? '<div class="form-group">' + input + '</div>' : input);
            this.base(arguments);
        },
        parseTemplate: _parseTemplate,
        labelText: '',
        simple: false,
        helpText: '',
		handlers: [{
			on: 'change',
            fn: 'onChange'
		}],
        onChange: function (e) { },
        prependLabel: function (template) {

            if (pz.isEmpty(this.labelText) || pz.arr.contains(['checkbox', 'radio'], this.inputType)) {
                return;
            };

            var label = pz.dom.createElement('label'), hasSize = !pz.isEmpty(this.size);
            label.innerText = this.labelText;

            this.addCss('col-form-label', label);
            this.addCss((hasSize ? ('col-form-label-' + this.size) : ''), label);
            label.setAttribute('for', ('input_' + this.id));

            if (this.inForm) {
                pz.dom.prepend(this.html, label);
            } else {
                pz.dom.insertBefore(this.html, label);
            };

            label = null;
        }
	};
});

pz.define('ui-bootstrap-list-group', function () {
    'use strict';

    var _const = {
        elementAtIdxNotFound: 'Element at index {0} was not found'
    };

    var _parseTemplate = function () {
        var tabContent;
        this.addCss((this.flushed ? 'list-group-flush' : ''));

        if (this.mode == 'tab') {
            pz.dom.insertAfter(this.html, '<div class="tab-content"></div>');
            tabContent = this.html.nextSibling;
        };

        pz.forEach(this.menuItems, function (menuItem, idx) {
            var actionable, link, contentCls, href, jsVoid = 'javascript:void(0)';

            if (this.noHash && this.mode != 'tab' && pz.isEmpty(menuItem.href)) {
                menuItem.href = !pz.isEmpty(this.href) ? this.href.replace('#', jsVoid) : jsVoid;
            };

            actionable = (this.actionable || this.mode == 'tab');

            if (actionable && pz.isEmpty(menuItem.href)) {
                throw new Error('Each menu item must have [href] property configured');
            };

            link = pz.dom.createElement((actionable ? 'a' : 'li'));
            this.addCss((actionable ? 'list-group-item' : 'list-group-item list-group-item-action'), link);

            if (actionable) {
                link.setAttribute('href', (menuItem.href || '#'));
            };

            this.addCss((!pz.isEmpty(menuItem.appearance) ? ('list-group-item-' + menuItem.appearance) : ''), link);
            link.innerText = menuItem.text || '';

            if (!pz.isEmpty(menuItem.css)) {
                this.addCss(menuItem.css, link);
            };

            if (this.mode == 'tab') {
                link.setAttribute('data-toggle', 'list');
                link.setAttribute('role', 'tab');
                href = menuItem.href.replace('#', '');
                contentCls = idx == 0 ? ('tab-pane active tab-' + href) : ('tab-pane tab-' + href);
                pz.dom.append(tabContent, '<div class="' + contentCls + '" id="' + href + '" role="tabpanel">' + menuItem.text + 'content' + '</div>');
            };

            pz.dom.append(this.html, link);
        }, this);
    };

    var _setEnabled = function (me, idx, value) {
        if (pz.isEmpty(idx)) {
            return;
        };

        var el = me.html.childNodes[idx];
        if (pz.isEmpty(el)) {
            var msg = pz.str.format(_const.elementAtIdxNotFound, idx);//_const.elementAtIdxNotFound.replace('{0}', idx);
            throw new Error(msg);
        };

        if (value) {
            el.className = el.className.replace('disabled', '').trim();
        } else {
            me.addCss('disabled', el);
        };
    };

    return {
        ownerType: 'ui-bootstrap-component',
        menuItems: [],
        actionable: false,
        flushed: false,
        mode: 'list',
        init: function () {

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

pz.define('ui-bootstrap-modal', function () {
    'use strict';

    var _primaryButtons = ['Yes', 'Ok'];

    var _parseTemplate = function () {
        var headerMarkup = '<div class="modal-header"><h5 class="modal-title">' + (this.header ? (pz.isEmpty(this.header.text) ? '' : this.header.text) : '') +
            '</h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>',
            bodyMarkup = '<div class="modal-body">' + (this.body ? (pz.isEmpty(this.body.text) ? '' : this.body.text) : '') + '</div>',
            footerMarkup = '<div class="modal-footer">' + (this.footer ? (pz.isEmpty(this.footer.text) ? '' : this.footer.text) : '') + '</div>',
            modalContent = pz.dom.findElement(this.html, 'div.modal-content'),
            header = pz.dom.findElement(this.html, 'div.modal-header > h5.modal-title'),
            body = pz.dom.findElement(this.html, 'div.modal-body'),
            footer = pz.dom.findElement(this.html, 'div.modal-footer'),
            modal, hasSize = !pz.isEmpty(this.size);

        var addOrUpdate = function (el, markup, value) {
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

    var _hasComponentsForSpecificRender = function (me, cssClass) {
        return pz.arr.contains(me.components, function (item) {
            return (pz.isEmpty(item.renderTo) && me.containerElement == ('div.' + cssClass)) || item.renderTo.indexOf(cssClass);
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
            this.footer = !pz.isEmpty(this.buttons) || this.footer;

            pz.forEach(buttons, function (button) {
                this.components.push({
                    type: 'ui-bootstrap-button',
                    appearance: (pz.arr.contains(_primaryButtons, button) || buttons.length == 1) ? 'primary' : 'secondary',
                    renderTo: 'div.modal-footer',
                    text: button,
                    onClick: function (e) {
                        me.onButtonClick.call(this, e, button);
                        if (me.autoHide) {
                            me.hide();
                        };
                    }
                });
            }, this);

            var hasBodyComponents = !pz.isEmpty(this.components) && _hasComponentsForSpecificRender(this, 'modal-body');

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
        show: function (config) {
            $(this.html).modal('show');
        },
        hide: function () {
            $(this.html).modal('hide');
        },
        update: function () {
            $(this.html).modal('handleUpdate');
        },
        toggle: function () {
            $(this.html).modal('toggle');
        },
        onButtonClick: function () { },
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

pz.define('ui-bootstrap-nav', function () {
    'use strict';

    var _const = {
        componentsNotAllowedInTabMode: 'Components in menu are not allowed while using tab mode',
        hrefIsRequired: 'Each menu item must have [href] property configured'
    };

    var _allowedComponents = [
        'ui-bootstrap-dropdown'
    ];

    var _parseTemplate = function () {
        var hasPosition = !pz.isEmpty(this.position),
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

        pz.forEach(this.menuItems, function (menuItem, idx) {
            var cls, link, href, contentCls,
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
        ownerType: 'ui-bootstrap-component',
        position: 'start',
        template: '<nav class="nav"></nav>',
        components: [],
        mode: 'nav',
        load: function () {
            this.template = (this.mode == 'tab') ? '<nav><div class="nav nav-tabs" role="tablist"></div></nav>' :
                '<nav class="nav"></nav>';
            this.base(arguments);
        },
        init: function () {
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

pz.define('ui-bootstrap-navbar', function () {
    'use strict';

    var _allowedComponents = [
        'ui-bootstrap-dropdown'
        //'ui-bootstrap-input-group'
    ];

	var _parseTemplate = function () {
		var prefix = this.sticky ? 'sticky' : 'fixed';
        var hasMenuItems = !pz.isEmpty(this.menu) && !pz.isEmpty(this.menu.items);

        this.toggler = this.toggler || hasMenuItems;

        if (!pz.isEmpty(this.brand)) {
            var isTextType = this.brand.type == 'text';
            var brand = pz.dom.createElement('a');

            brand.setAttribute('href', (this.brand.href || '#'));
            this.addCss('navbar-brand', brand);

            if (isTextType) {
				brand.innerHTML = this.brand.value;
            } else {
                var brandImg = pz.dom.createElement('img');
                brandImg.setAttribute('src', this.brand.imageSrc);
                pz.dom.append(brand, brandImg);
            };

            pz.dom.append(this.html, brand);
		};

		if (this.toggler) {
			pz.dom.append(this.html, '<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapse_' + this.id + '"><span class="navbar-toggler-icon"></span></button>');
		};

        if (hasMenuItems) {
            pz.dom.append(this.html, '<div class="collapse navbar-collapse" id="collapse_' + this.id + '"></div>');

            var collapse = pz.dom.findElement(this.html, 'div#collapse_' + this.id);
            var menuPos = this.menu.position || 'left'; // left by default
            var hPositionClass = 'm'.concat(menuPos == 'left' ? 'r-' : 'l-').concat('auto');

            pz.dom.append(collapse, '<ul class="navbar-nav ' + hPositionClass + '"></ul>'); 

            var ul = pz.dom.findElement(collapse, 'ul.navbar-nav');
            pz.forEach(this.menu.items, function (menuItem) {
                if (pz.arr.contains(_allowedComponents, menuItem.type)) {
                    menuItem.renderTo = 'ul.navbar-nav';
                    this.components.push(menuItem);
                } else {
                    pz.dom.append(ul, '<li class="nav-item"><a class="nav-link" href="' + (menuItem.href || '#') + '">' + menuItem.text + '</a></li>');
                };
            }, this);
        };

        this.addCss('navbar '.concat(prefix).concat('-')
            .concat(this.position).concat(' bg-')
            .concat(this.theme).concat(' navbar-expand-lg'));
	};

    return {
        ownerType: 'ui-bootstrap-component',
        position: 'top',
        template: '<nav></nav>',
        theme: 'light',
        components: [],
        menu: {},
		brand: {
			type: 'text',
			value: 'My app'
		},
		sticky: false,
		toggler: false,
		parseTemplate: _parseTemplate
	};
});

pz.define('ui-bootstrap-progress', function () {
	'use strict';

	var _parseTemplate = function () {
		var progressBar = pz.dom.findElement(this.html, 'div.progress-bar'),
            hasAppearance = !pz.isEmpty(this.appearance),
            hasNowValue = !pz.isEmpty(this.values.now) && this.values.now > 0,
            max = this.values.max || 100,
            min = this.values.min || 0, val;

        this.html.setAttribute('aria-valuemin', min);
        this.html.setAttribute('aria-valuemax', max);

		this.addCss((hasAppearance ? ('bg-' + this.appearance) : ''), progressBar);
		this.addCss((this.animated ? ('progress-bar-striped progress-bar-animated') : ''), progressBar);

        if (hasNowValue) {
            this.addStyle(('width:' + this.values.now + '%'), progressBar);
			this.html.setAttribute('aria-valuenow', this.values.now);
		};

        if (this.showValue && hasNowValue) {
			progressBar.innerText = (this.values.now + '%');
        };
	};

	return {
		ownerType: 'ui-bootstrap-component',
		template: '<div class="progress"><div class="progress-bar" role="progressbar"></div></div>',
		showValue: true,
		animated: false,
		values: {
			min: 0,
			now: 25,
			max: 100
		},
		parseTemplate: _parseTemplate,
		setValues: function (values) {
			if (pz.isEmpty(values)) {
				return;
			};

			this.values = values;
			this.parseTemplate();
		}
	};
});

pz.define('ui-bootstrap-select', function () {
    'use strict';

    var _parseTemplate = function () {
        var hasSize = !pz.isEmpty(this.size);
        var css = (this.custom ? (hasSize ? ('custom-select custom-select-' + this.size) : 'custom-select') :
            (hasSize ? ('form-control form-control-' + this.size) : 'form-control'));
        this.addCss(css);
        if (this.multiple) {
            this.html.setAttribute('multiple', true);
        };

        pz.forEach(this.dataSource, function (item) {
            var valField = item[this.valueField],
                disField = item[this.displayField],
                option = pz.dom.createElement('option');

            option.innerText = disField;
            option.setAttribute('value', valField);
            pz.dom.append(this.html, option);
            option = null;
        }, this);
    };

    return {
        ownerType: 'ui-bootstrap-component',
        labelText:'',
        template: '<select></select>',
        mixins: ['ui-bootstrap-form-field-mix'],
        dataSource: [],
        custom: false,
        multiple: false,
        valueField: 'id',
        displayField: 'value',
        parseTemplate: _parseTemplate,
        handlers: [{
            on: 'change',
            fn: 'onChange'
        }],
        onChange: function () { },
        setDataSource: function (data) {
            if (pz.isEmpty(data) || pz.isEmpty(this.html)) {
                return;
            };

            this.dataSource = data;
            this.parseTemplate();
        }
    };
});
