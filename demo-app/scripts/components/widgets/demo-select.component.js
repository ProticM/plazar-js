pz.define('select-component', function() {
    var _buildTemplate = function(me) {
        var showLabel = !pz.isEmpty(me.label);
        var showHelpText = !pz.isEmpty(me.helpText);
        var hasLabelText = showLabel && !pz.isEmpty(me.label.text);
        var field = '<div class="select"><select></select></div>', select;
        if(showLabel) {
            pz.dom.append(me.html, '<label class="label">' + 
                (hasLabelText ? me.label.text : 'Label') + '</label>');
        };

        pz.dom.append(me.html, field);
        select = pz.dom.findElement(me.html, 'select');
        pz.forEach(me.options, function(option) {
            pz.dom.append(select, '<option value="' + option.value + '">' + option.text + '</option>');
        });

        if(showHelpText) {
            pz.dom.append(me.html, '<p class="help">' + me.helpText + '</p>');
        };
        
    };

    return {
        ownerType: 'base-component',
        template: '<div class="field"></div>',
        label: null,
        helpText: null,
        options: [],
        init: function() {
            this.base(arguments);
            this.handle({
                on: 'change',
                fn: 'onChange',
                selector: 'select'
            });
        },
        render: function() {
            this.base(arguments);
            _buildTemplate(this);
        },
        onChange: function() { }
    };

});