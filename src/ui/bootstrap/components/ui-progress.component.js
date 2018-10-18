plz.define('ui-bootstrap-progress', function () {
	'use strict';

	var _parseTemplate = function () {
		var progressBar = plz.dom.findElement(this.html, 'div.progress-bar'),
            hasAppearance = !plz.isEmpty(this.appearance),
            hasNowValue = !plz.isEmpty(this.values.now) && this.values.now > 0,
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
			if (plz.isEmpty(values)) {
				return;
			};

			this.values = values;
			this.parseTemplate();
		}
	};
});
