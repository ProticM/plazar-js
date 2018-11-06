pz.define('menu-component', function() {

    var _preInit = function(me) {
        pz.forEach(me.items, function(item, idx) {
            var cls = item.isActive ? 'menu-item is-active' : 'menu-item';
            var liCls = 'li-menu-item-' + idx;
            var link = pz.dom.parseTemplate('<a class="' + cls + ' has-text-white">' + item.text + '</a>');
            
            if(!pz.isEmpty(item.view)) {
                this.addAttr({
                    name: 'data-view',
                    value: item.view
                }, link);
            };

            var el = pz.dom.parseTemplate('<li class="' + liCls + '"></li>');

            pz.dom.append(el, link);
            pz.dom.append(this.html, el);
            
            if(!pz.isEmpty(item.components)) {
                this.components = pz.arr.map(function(comp) {
                    var c = pz.obj.assignTo({}, comp);
                    c.renderTo = 'li.li-menu-item-' + idx;
                    return c;
                }, item.components);
            }
        }, me);
    };

    var _toggleActiveState = function(el) {
        var links = document.querySelectorAll('a.menu-item');
        pz.forEach(links, function(link) {
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