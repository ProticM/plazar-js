import pz from '@plazarjs/core';

const container = () => {

    let _defaultColSize = 12;

    let _getColumnSizeClass = (size) => {
        let _default = 'col-' + _defaultColSize,
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

    let _parseJumbotron = (me, jumbotron) => {

        let hasBtn, hasLeadText, hasTitle, hasDivider, mainContainer;
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
            let size = jumbotron.title.size || 4;
            let text = jumbotron.title.text || 'Welcome';
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
            pz.forEach(jumbotron.buttons, (button) => {
                let btn = {};
                pz.assignTo(btn, button, false);
                btn.renderTo = 'p.lead.jumbotron-button';

                if (pz.isEmpty(btn.type)) {
                    btn.type = 'ui-bootstrap-button';
                };

                me.components.push(btn);
            });
        };
    };

    return {
        type: 'ui-bootstrap-container',
        ownerType: 'ui-bootstrap-component',
        template: '<div></div>',
        renderAs: 'container', // can be row, form-row, container, column, jumbotron
        fluid: false,
        body: '', // can be html
        components: [],
        parseTemplate: function() {

            let cls = this.renderAs == 'row' ? 'row' :
                (this.renderAs == 'form-row' ? 'form-row' : (this.renderAs == 'column' ? _getColumnSizeClass(this.column) :
                    (this.renderAs == 'jumbotron' ? (this.fluid ? 'jumbotron jumbotron-fluid' : 'jumbotron') :
                        (this.fluid ? 'container-fluid' : 'container'))));

            let hasChildren = !pz.isEmpty(this.components);
            this.addCss(cls);
            this.html.innerHTML = (hasChildren ? '' : (pz.isEmpty(this.body) ? '' : this.body));

            if (this.renderAs == 'jumbotron') {
                _parseJumbotron(this, this.jumbotron);
            };
        }
    };
};

export default container;
