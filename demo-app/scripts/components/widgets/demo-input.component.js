plz.define('input-component', function() {

    var _buildTemplate = function(me) {
        var showLabel = !plz.isEmpty(me.label);
        var hasPlaceHolder = !plz.isEmpty(me.placeholder);
        var hasLabelText = showLabel && !plz.isEmpty(me.label.text);
        var field = '<div class="control"><input class="input" type="text"' +
            ' placeholder="' + (hasPlaceHolder ? me.placeholder : 'Enter text') + '"></div>';

        if(showLabel) {
            plz.dom.append(me.html, '<label class="label">' + 
                (hasLabelText ? me.label.text : 'Label') + '</label>');
        };

        plz.dom.append(me.html, field);
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