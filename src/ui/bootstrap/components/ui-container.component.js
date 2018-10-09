plz.define('ui-bootstrap-container', function () {
    'use strict';

    var _defaultColSize = 12;

    var _getColumnSizeClass = function (size) {
        var _default = 'col-' + _defaultColSize,
            lg, md, sm, css;

        if (plz.isEmpty(size)) {
            return _default;
        };

        lg = !plz.isEmpty(size.lg) ? 'col-lg-' + size.lg : '';
        md = !plz.isEmpty(size.md) ? ' col-md-' + size.md : '';
        sm = !plz.isEmpty(size.sm) ? ' col-sm-' + size.sm : '';

        css = lg + md + sm;
        return !plz.isEmpty(css) ?
            css : _default;
    };

    var _parseJumbotron = function (me, jumbotron) {

        var hasBtn, hasLeadText, hasTitle, hasDivider, mainContainer;
        if (plz.isEmpty(jumbotron)) {
            return;
        };

        hasBtn = !plz.isEmpty(jumbotron.buttons);
        hasLeadText = !plz.isEmpty(jumbotron.leadText);
        hasTitle = !plz.isEmpty(jumbotron.title);
        hasDivider = !plz.isEmpty(jumbotron.divider);
        mainContainer = me.html;
        
        if (me.fluid) {
            plz.dom.append(me.html, '<div class="container' + (jumbotron.innerFluid ? '-fluid' : '') + ' jumbotron-body"></div>');
            mainContainer = plz.dom.findElement(me.html, 'div.jumbotron-body');
        };

        if (hasTitle) {
            var size = jumbotron.title.size || 4;
            var text = jumbotron.title.text || 'Welcome';
            plz.dom.append(mainContainer, '<h1 class="display-' + size + '">' + text + '</h1>');
        };

        if (hasLeadText) {
            plz.dom.append(mainContainer, '<p class="lead">' + jumbotron.leadText + '</p>');
        };

        if (hasBtn) {

            if (hasDivider) {
                plz.dom.append(mainContainer, '<hr class="my-' + (jumbotron.divider.size || 4) + '">');
            };

            plz.dom.append(mainContainer, '<p class="lead jumbotron-button"></p>');
            plz.forEach(jumbotron.buttons, function (button) {
                var btn = {};
                plz.obj.assignTo(btn, button, false);
                btn.renderTo = 'p.lead.jumbotron-button';

                if (plz.isEmpty(btn.type)) {
                    btn.type = 'ui-bootstrap-button';
                };

                me.components.push(btn);
            });
        };
    };

    return {
        ownerType: 'ui-component',
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

            var hasChildren = !plz.isEmpty(this.components);
            this.addCss(cls);
            this.html.innerHTML = (hasChildren ? '' : (plz.isEmpty(this.body) ? '' : this.body));

            if (this.renderAs == 'jumbotron') {
                _parseJumbotron(this, this.jumbotron);
            };
        }
    };
});
