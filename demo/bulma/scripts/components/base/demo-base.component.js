pz.define('base-component', {
    ownerType: 'component',
    changeView: function(componentType) {
        var oldC, layoutC = pz.getInstanceOf('layout-component');
        if(pz.isEmpty(componentType) || componentType == layoutC.currentView) {
            return;
        };

        oldC = pz.getInstanceOf(layoutC.currentView);
        if(!pz.isEmpty(oldC)) {
            oldC.destroy();
        };
        
        layoutC.currentView = componentType;
        layoutC.addChild({
            type: componentType
        });
    }
});