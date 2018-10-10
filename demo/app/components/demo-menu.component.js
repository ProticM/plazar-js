plz.define('menu-component', function() {

    var _buildTemplate = function(me) {
        plz.forEach(me.items, function(item, idx) {
            var el = plz.dom.parseTemplate('<li class="menu-item" data-view="' + item.view + '">' + 
                item.text + '</li>');
            plz.dom.append(me.html, el);
        }, me);
    };

    return {
        ownerType: 'base-component',
        autoLoad: true,
        template: '<ul></ul>',
        style: 'list-style:none',
        items: [],
        init: function() {
            _buildTemplate(this);
            this.base(arguments);
        },
        handlers: [{
            on: 'click',
            selector: 'li.menu-item',
            fn: 'itemClick'
        }],
        itemClick: function (el) {
            var view = el.getAttribute('data-view');
            this.changeView(view);
        }
    };

});