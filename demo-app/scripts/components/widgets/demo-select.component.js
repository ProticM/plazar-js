plz.define('select-component', function() {
    var _buildTemplate = function(me) {
        var showLabel = !plz.isEmpty(me.label);
        var showHelpText = !plz.isEmpty(me.helpText);
        var hasLabelText = showLabel && !plz.isEmpty(me.label.text);
        var field = '<div class="select"><select></select></div>', select;
        if(showLabel) {
            plz.dom.append(me.html, '<label class="label">' + 
                (hasLabelText ? me.label.text : 'Label') + '</label>');
        };

        plz.dom.append(me.html, field);
        select = plz.dom.findElement(me.html, 'select');
        plz.forEach(me.options, function(option) {
            plz.dom.append(select, '<option value="' + option.value + '">' + option.text + '</option>');
        });

        if(showHelpText) {
            plz.dom.append(me.html, '<p class="help">' + me.helpText + '</p>');
        };
        
    };

    return {
        ownerType: 'base-component',
        template: '<div class="field"></div>',
        label: null,
        helpText: null,
        options: [],
        render: function() {
            this.base(arguments);
            _buildTemplate(this);
        }
    };

});