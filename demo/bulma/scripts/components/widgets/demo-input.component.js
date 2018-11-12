pz.define('input-component', function() {

    var _buildTemplate = function(me) {
        var showLabel = !pz.isEmpty(me.label);
        var hasPlaceHolder = !pz.isEmpty(me.placeholder);
        var hasLabelText = showLabel && !pz.isEmpty(me.label.text);
        var field = '<div class="control"><input class="input" type="text"' +
            ' placeholder="' + (hasPlaceHolder ? me.placeholder : 'Enter text') + '"></div>';

        if(showLabel) {
            pz.dom.append(me.html, '<label class="label">' + 
                (hasLabelText ? me.label.text : 'Label') + '</label>');
        };

        pz.dom.append(me.html, field);
    };

    return {
        ownerType: 'base-component',
        template: '<div class="field"></div>',
        label: null,
        render: function() {
            this.base(arguments);
            _buildTemplate(this);
        }
    };

});