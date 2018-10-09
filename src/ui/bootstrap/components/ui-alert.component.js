plz.define('ui-bootstrap-alert', function () {
    'use strict';

    var _parseTemplate = function () {

        this.addCss('alert-'.concat(this.appearance));

        var renderLink = !plz.isEmpty(this.link), animation;
        var renderHeading = !plz.isEmpty(this.heading);

        if (renderHeading) {
            plz.dom.append(this.html, '<h' + (this.heading.size || 4) + ' class="alert-heading">' +
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
            plz.dom.append(this.html, '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>');
        };
    };

    return {
        ownerType: 'ui-component',
        template: '<div class="alert" role="alert"><div>',
        appearance: 'primary',
        text: '',
        dismissible: false,
        linkPlaceHolder: '##',
        parseTemplate: _parseTemplate,
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
        }
    };
});
