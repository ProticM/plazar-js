plz.define('menu-component', function() {

    var _preInit = function(me) {
        plz.forEach(me.items, function(item, idx) {
            var cls = item.isActive ? 'menu-item is-active' : 'menu-item';
            var liCls = 'li-menu-item-' + idx;
            var link = plz.dom.parseTemplate('<a class="' + cls + '">' + item.text + '</a>');
            
            if(!plz.isEmpty(item.view)) {
                this.addAttr({
                    name: 'data-view',
                    value: item.view
                }, link);
            };

            var el = plz.dom.parseTemplate('<li class="' + liCls + '"></li>');

            plz.dom.append(el, link);
            plz.dom.append(this.html, el);
            
            if(!plz.isEmpty(item.components)) {
                this.components = plz.arr.map(function(comp) {
                    var c = plz.obj.assignTo({}, comp);
                    c.renderTo = 'li.li-menu-item-' + idx;
                    return c;
                }, item.components);
            }
        }, me);
    };

    var _toggleActiveState = function(el) {
        var links = document.querySelectorAll('a.menu-item');
        plz.forEach(links, function(link) {
            link.classList.remove('is-active');
        });
        el.classList.add('is-active');
    };

    return {
        ownerType: 'base-component',
        autoLoad: true,
        template: '<ul></ul>',
        css: ['menu-list'],
        items: [],
        init: function() {
            _preInit(this);
            this.base(arguments);
        },
        handlers: [{
            on: 'click',
            selector: 'a.menu-item',
            fn: 'itemClick'
        }],
        itemClick: function (el) {
            var view = el.getAttribute('data-view');
            _toggleActiveState(el);
            this.changeView(view);
        }
    };

});