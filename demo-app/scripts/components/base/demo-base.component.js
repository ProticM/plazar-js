plz.define('base-component', {
    ownerType: 'component',
    changeView: function(componentType) {
        var oldC, layoutC = plz.getInstanceOf('layout-component');
        if(plz.isEmpty(componentType) || componentType == layoutC.currentView) {
            return;
        };

        oldC = plz.getInstanceOf(layoutC.currentView);
        if(!plz.isEmpty(oldC)) {
            oldC.destroy();
        };
        
        layoutC.currentView = componentType;
        layoutC.addChild({
            type: componentType
        });
    }
});