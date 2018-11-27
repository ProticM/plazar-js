import pz from '@plazarjs/core';

const breadcrumb = () => {
    
    let _createCrumbs = (me, crumbs) => {
        let ul = pz.dom.findElement(me.html, 'ol.breadcrumb');
        pz.forEach(crumbs, (crumb) => {
            let cls = crumb.isActive ? 'breadcrumb-item active' : 'breadcrumb-item';
            let attr = crumb.isActive ? ' aria-current="page"' : '';
            let text = crumb.asLink ? '<a href="' + (crumb.href || '#') + '">' + crumb.text + '</a>' : crumb.text;

            pz.dom.append(ul, '<li class="' + cls + '"' + attr + '>' + text + '</li>');
        });
    };

    let _parseTemplate = function() {
        _createCrumbs(this, this.crumbs);
    };

    return {
        type: 'ui-bootstrap-breadcrumb',
        ownerType: 'ui-bootstrap-component',
        template: '<nav aria-label="breadcrumb"><ol class="breadcrumb"></ol></nav>',
        parseTemplate: _parseTemplate,
        crumbs: [],
        addCrumbs: function(crumb) {
            let isArray, method;

            if (pz.isEmpty(crumb)) {
                return;
            };

            isArray = pz.isArray(crumb);
            method = isArray ? 'concat' : 'push';
            this.crumbs = this.crumbs[method](crumb);
            _createCrumbs(this, isArray ? crumb : [crumb]);
        }
    };
};

export default breadcrumb;
