plz.define('menu-component', function() {

    var _buildTemplate = function(me) {
        plz.forEach(me.items, function(item) {
            var el = plz.dom.parseTemplate('<li"><a data-view="' + item.view + '" class="menu-item">' + 
                item.text + '</a></li>');
            plz.dom.append(me.html, el);
        }, me);
    };

    return {
        ownerType: 'base-component',
        autoLoad: true,
        template: '<ul></ul>',
        css: ['menu-list'],
        items: [],
        init: function() {
            _buildTemplate(this);
            this.base(arguments);
        },
        handlers: [{
            on: 'click',
            selector: 'a.menu-item',
            fn: 'itemClick'
        }],
        itemClick: function (el) {
            var view = el.getAttribute('data-view');
            this.changeView(view);
        }
    };

});