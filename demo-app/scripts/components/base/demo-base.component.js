plz.define('base-component', {
    ownerType: 'component',
    currentView: 'home-component',
    changeView: function(componentType) {
        var oldC, layoutC;
        if(plz.isEmpty(componentType) || componentType == this.currentView) {
            return;
        };

        oldC = plz.getInstanceOf(this.currentView);
        if(!plz.isEmpty(oldC)) {
            oldC.destroy();
        };
        
        this.currentView = componentType;
        layoutC = plz.getInstanceOf('layout-component');
        layoutC.addChild({
            type: componentType
        });
    }
});