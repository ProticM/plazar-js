plz.define('ui-bootstrap-breadcrumb', function () {
    'use strict';

    var _createCrumbs = function (me, crumbs) {
        var ul = plz.dom.findElement(me.html, 'ol.breadcrumb');
        plz.forEach(crumbs, function (crumb) {
            var cls = crumb.isActive ? 'breadcrumb-item active' : 'breadcrumb-item';
            var attr = crumb.isActive ? ' aria-current="page"' : '';
            var text = crumb.asLink ? '<a href="' + (crumb.href || '#') + '">' + crumb.text + '</a>' : crumb.text;

            plz.dom.append(ul, '<li class="' + cls + '"' + attr + '>' + text + '</li>');
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

            if (plz.isEmpty(crumb)) {
                return;
            };

            isArray = plz.isArray(crumb);
            method = isArray ? 'concat' : 'push';
            this.crumbs = this.crumbs[method](crumb);
            _createCrumbs(this, isArray ? crumb : [crumb]);
        }
    };
});
