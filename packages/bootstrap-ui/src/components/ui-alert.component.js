import pz from '@plazarjs/core';
import $ from 'jquery';
import uiBase from '../base/ui-base.component';

const alert = () => {

    let _parseTemplate = function() {

        this.addCss('alert-'.concat(this.appearance));

        let renderLink = !pz.isEmpty(this.link), animation;
        let renderHeading = !pz.isEmpty(this.heading);

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
        type: 'ui-bootstrap-alert',
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
        close: function() {
            $(this.html).alert('close');
        },
        destroy: function() {
            $(this.html).alert('dispose');
            this.base(arguments);
        },
        onClose: function(e) {
            this.publish('close-bs-alert', e);
        },
        onClosed: function(e) {
            this.publish('closed-bs-alert', e);
            if(this.autoDestroy) {
                this.destroy();
            }
        }
    };
};

export default uiBase.extend(alert);
